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
#include <foss/gtest/gtest.h>
#include <json/json-obj.h>

void
verify_data_gen(JsManager::ptr mgr)
{
#if 0
    DataGenerator::ptr gen = object_cast<DataGenerator>(
            mgr->js_lookup_type(DATA_GENERATOR));

    if (gen == NULL) {
        printf("\t\tNo " DATA_GENERATOR " section, skip...\n");
        return;
    }
    for (int o = 0; o < gen->js_array_size(); o++) {
        DataGeneratorSub::ptr sub = object_cast<DataGeneratorSub>((*gen)[o]);
        EXPECT_TRUE(sub != NULL);
        if (sub == NULL) {
            continue;
        }
        int objs_found  = 0;
        int beg         = sub->js_kv_int(OBJ_BEG_SEQ);
        int count       = sub->js_kv_int(OBJ_COUNT);
        const char *fmt = sub->js_kv_str(OBJ_ID_FMT);

        for (int i = beg; i < count; i++) {
            JsObj::ptr obj = mgr->js_lookup_idref(fmt, i);
            if (obj != NULL) {
                objs_found++;
            }
            EXPECT_TRUE(obj != NULL);
        }
        EXPECT_EQ(objs_found, count);
        if (objs_found == count) {
            printf("\t\tVerified %d objects generated for %s\n",
                   count, sub->js_kv_str(OBJ_TYPE));
        }
    }
#endif
}
