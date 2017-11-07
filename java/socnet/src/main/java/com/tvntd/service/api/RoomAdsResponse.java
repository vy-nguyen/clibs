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

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;

public class RoomAdsResponse extends GenericResponse
{
    static private Logger s_log = LoggerFactory.getLogger(RoomAdsResponse.class);
    protected Map<String, ArtRoomAdsDTO> uuidList;
    protected FeatureMenu featureMenu;

    public RoomAdsResponse(String message) {
        super(GenericResponse.USER_HOME, message, null);
    }

    public void addAds(ArtRoomAdsDTO ads)
    {
        if (uuidList == null) {
            uuidList = new HashMap<>();
        }
        uuidList.put(ads.getArticleUuid(), ads);
    }

    public void loadJson(String file)
    {
        String relPath = "json/" + file;
        URL url = getClass().getClassLoader().getResource(relPath);

        if (url == null) {
            s_log.info("Invalid json file " + relPath);
            System.out.println("Invalid file " + relPath);
            return;
        }
        File f = new File(url.getFile());
        try {
            Gson gson = new Gson();
            Reader rf = new FileReader(f);

            featureMenu = gson.fromJson(rf, FeatureMenu.class);
            rf.close();

        } catch(IOException e) {
            s_log.info("Failed to read file: " + e.getMessage());
        }
    }

    /**
     * @return the adsList
     */
    public Map<String, ArtRoomAdsDTO> getUuidList() {
        return uuidList;
    }

    /**
     * @return the featureMenu
     */
    public FeatureMenu getFeatureMenu() {
        return featureMenu;
    }

    /**
     * @param featureMenu the featureMenu to set
     */
    public void setFeatureMenu(FeatureMenu featureMenu) {
        this.featureMenu = featureMenu;
    }

    /**
     * @param adsList the adsList to set
     */
    public void setAdsList(Map<String, ArtRoomAdsDTO> uuidList) {
        this.uuidList = uuidList;
    }

    /**
     * Feature menu to filter out series of selections.
     */
    public static class FeatureMenu
    {
        protected SelectMenu usa;
        protected SelectMenu tagMenu;

        /**
         * @return the usa
         */
        public SelectMenu getUsa() {
            return usa;
        }

        /**
         * @param usa the usa to set
         */
        public void setUsa(SelectMenu usa) {
            this.usa = usa;
        }

        /**
         * @return the tagMenu
         */
        public SelectMenu getTagMenu() {
            return tagMenu;
        }

        /**
         * @param tagMenu the tagMenu to set
         */
        public void setTagMenu(SelectMenu tagMenu) {
            this.tagMenu = tagMenu;
        }
    }

    public static class SelectMenu
    {
        protected String value;
        protected String label;
        protected String title;
        protected String[] tags;
        protected SelectMenu[] selOpt;

        /**
         * @return the value
         */
        public String getValue() {
            return value;
        }

        /**
         * @param value the value to set
         */
        public void setValue(String value) {
            this.value = value;
        }

        /**
         * @return the label
         */
        public String getLabel() {
            return label;
        }

        /**
         * @param label the label to set
         */
        public void setLabel(String label) {
            this.label = label;
        }

        /**
         * @return the title
         */
        public String getTitle() {
            return title;
        }

        /**
         * @param title the title to set
         */
        public void setTitle(String title) {
            this.title = title;
        }

        /**
         * @return the tags
         */
        public String[] getTags() {
            return tags;
        }

        /**
         * @param tags the tags to set
         */
        public void setTags(String[] tags) {
            this.tags = tags;
        }

        /**
         * @return the selOpt
         */
        public SelectMenu[] getSelOpt() {
            return selOpt;
        }

        /**
         * @param selOpt the selOpt to set
         */
        public void setSelOpt(SelectMenu[] selOpt) {
            this.selOpt = selOpt;
        }
    }
}
