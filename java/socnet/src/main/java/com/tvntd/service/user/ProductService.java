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
package com.tvntd.service.user;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.tvntd.dao.ArticleRankRepo;
import com.tvntd.dao.ProductRepository;
import com.tvntd.models.Product;
import com.tvntd.service.api.IAuthorService;
import com.tvntd.service.api.ICommentService;
import com.tvntd.service.api.IProductService;

@Service
@Transactional
public class ProductService implements IProductService
{
    @Autowired
    protected ArticleRankRepo artRankRepo;

    @Autowired
    protected ProductRepository productRepo;

    @Autowired
    protected IAuthorService authorSvc;

    @Autowired
    protected ICommentService commentSvc;

    @Override
    public ProductDTO getProductDTO(String uuid)
    {
        return null;
    }

    @Override
    public Product getProduct(String uuid)
    {
        return null;
    }

    @Override
    public List<ProductDTO> convert(List<Product> products)
    {
        return null;
    }

    @Override
    public List<ProductDTO> getProducts(List<String> uuids)
    {
        return null;
    }

    @Override
    public List<ProductDTO> getProductsByUser(Long userId)
    {
        return null;
    }

    @Override
    public List<ProductDTO> getProductsByUser(String userUuid)
    {
        return null;
    }

    @Override
    public List<ProductDTO> getProductsByUser(List<String> userUuids)
    {
        return null;
    }

    @Override
    public Page<ProductDTO> getUserProducts(Long userId)
    {
        return null;
    }

    @Override
    public Page<ProductDTO> getUserProducts(String userUuid)
    {
        return null;
    }

    @Override
    public void saveProduct(Product prod)
    {
    }

    @Override
    public void saveProduct(ProductDTO prod)
    {
    }

    @Override
    public void deleteProduct(Product prod)
    {
    }

    @Override
    public void deleteProduct(String uuid)
    {
    }
}
