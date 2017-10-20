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
package com.tvntd.service.api;

import java.util.List;

import com.google.maps.model.GeocodingResult;
import com.tvntd.models.AddressMap;

public interface IMapService
{
    GeocodingResult mapAddress(String street,
            String city, String state, GenericResponse out);

    GeocodingResult mapZipLocation(String zip, GenericResponse out);
    GeocodingResult mapStateLocation(String state, GenericResponse out);

    AddressMapDTO saveAddress(String artUuid, String address, GenericResponse out);
    AddressMapDTO saveAddress(String artUuid, GeocodingResult result);
    AddressMapDTO getAddressFromUuid(String artUuid);
    AddressMapDTO getAddressFromPlace(String placeId);

    List<AddressMapDTO> getAddressFromUuids(List<String> artUuid);
    List<AddressMapDTO> getAddressFromPlaces(List<String> placeId);

    void deleteAddress(String artUuid);
    void deletePlaceId(String placeId);

    void genKnownLocations();

    /**
     * DTO wrapper object.
     */
    public static class AddressMapDTO
    {
        protected AddressMap addrMap;

        public AddressMapDTO(AddressMap addr) {
            addrMap = addr;
        }

        public String getArticleUuid() {
            return addrMap.getArticleUuid();
        }

        public String getPlaceId() {
            return addrMap.getPlaceId();
        }

        public Double getLat() {
            return addrMap.getLat();
        }

        public Double getLng() {
            return addrMap.getLng();
        }
    }
}
