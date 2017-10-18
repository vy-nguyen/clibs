/*
 * Copyright (C) 2014-2015 Vy Nguyen
 * Github https://github.com/vy-nguyen/tvntd
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */
package com.tvntd.service.google;

import java.io.IOException;
import java.util.LinkedList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.errors.ApiException;
import com.google.maps.model.GeocodingResult;
import com.tvntd.dao.AddressMapRepo;
import com.tvntd.models.AddressMap;
import com.tvntd.service.api.GenericResponse;
import com.tvntd.service.api.IMapService;

@Service
@Transactional
public class MapService implements IMapService
{
    @Autowired
    protected GeoApiContext geoContext;

    @Autowired
    protected AddressMapRepo addrRepo;

    @Override
    public GeocodingResult mapAddress(String street,
            String city, String state, GenericResponse out) {
        return getLocation(street + " " + city + ", " + state, out);
    }

    @Override
    public GeocodingResult mapZipLocation(String zip, GenericResponse out) {
        return getLocation(zip, out);
    }

    @Override
    public GeocodingResult mapStateLocation(String state, GenericResponse out) {
        return getLocation(state, out);
    }

    protected GeocodingResult getLocation(String addr, GenericResponse out)
    {
        try {
            GeocodingResult[] results = GeocodingApi.geocode(geoContext, addr).await();
            return results[0];

        } catch(ApiException | InterruptedException | IOException e) {
            System.out.println(e.getMessage());
            out.setMessage(e.getMessage());
        }
        return null;
    }

    @Override
    public AddressMapDTO saveAddress(String artUuid, GeocodingResult result)
    {
        AddressMap adr = new AddressMap(artUuid, result);

        addrRepo.save(adr);
        return new AddressMapDTO(adr);
    }

    public AddressMapDTO getAddressFromUuid(String artUuid)
    {
        AddressMap adr = addrRepo.findByArticleUuid(artUuid);

        if (adr != null) {
            return new AddressMapDTO(adr);
        }
        return null;
    }

    public AddressMapDTO getAddressFromPlace(String placeId)
    {
        AddressMap adr = addrRepo.findByPlaceId(placeId);

        if (adr != null) {
            return new AddressMapDTO(adr);
        }
        return null;
    }

    protected List<AddressMapDTO> convertList(List<AddressMap> src)
    {
        List<AddressMapDTO> out = new LinkedList<>();

        for (AddressMap adr : src) {
            out.add(new AddressMapDTO(adr));
        }
        return out;
    }

    public List<AddressMapDTO> getAddressFromUuids(List<String> artUuid) {
        return convertList(addrRepo.findByArticleUuidIn(artUuid));
    }

    public List<AddressMapDTO> getAddressFromPlaces(List<String> placeId) {
        return convertList(addrRepo.findByPlaceIdIn(placeId));
    }

    public void deleteAddress(String artUuid)
    {
        AddressMap adr = addrRepo.findByArticleUuid(artUuid);

        if (adr != null) {
            addrRepo.delete(adr);
        }
    }

    public void deletePlaceId(String placeId)
    {
        AddressMap adr = addrRepo.findByPlaceId(placeId);

        if (adr != null) {
            addrRepo.delete(adr);
        }
    }

    public void genKnownLocations()
    {
        AddressMap adr = addrRepo.findByArticleUuid("CA");

        if (adr != null) {
            return;
        }
        String[] knownLoc = {
            "Alabama",       "AL", "Montana",        "MT",
            "Alaska",        "AK", "Nebraska",       "NE",
            "Arizona",       "AZ", "Nevada",         "NV",
            "Arkansas",      "AR", "New Hampshire",  "NH",
            "California",    "CA", "New Jersey",     "NJ",
            "Colorado",      "CO", "New Mexico",     "NM",
            "Connecticut",   "CT", "New York",       "NY",
            "Delaware",      "DE", "North Carolina", "NC",
            "Florida",       "FL", "North Dakota",   "ND",
            "Georgia",       "GA", "Ohio",           "OH",
            "Hawaii",        "HI", "Oklahoma",       "OK",
            "Idaho",         "ID", "Oregon",         "OR",
            "Illinois",      "IL", "Pennsylvania",   "PA",
            "Indiana",       "IN", "Rhode Island",   "RI",
            "Iowa",          "IA", "South Carolina", "SC",
            "Kansas",        "KS", "South Dakota",   "SD",
            "Kentucky",      "KY", "Tennessee",      "TN",
            "Louisiana",     "LA", "Texas",          "TX",
            "Maine",         "ME", "Utah",           "UT",
            "Maryland",      "MD", "Vermont",        "VT",
            "Massachusetts", "MA", "Virginia",       "VA",
            "Michigan",      "MI", "Washington",     "WA",
            "Minnesota",     "MN", "West Virginia",  "WV",
            "Mississippi",   "MS", "Wisconsin",      "WI",
            "Missouri",      "MO", "Wyoming",        "WY"
        };
        GenericResponse out = new GenericResponse("");

        for (String s : knownLoc) {
            GeocodingResult res = mapStateLocation(s, out);
            if (res != null) {
                saveAddress(s, res);
            } else {
                System.out.println("Failed to lookup " + s + ": " + out.getMessage());
            }
        }
    }
}
