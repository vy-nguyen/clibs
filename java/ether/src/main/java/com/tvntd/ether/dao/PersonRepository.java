/*
 *--------1---------2---------3---------4---------5---------6---------7---------8--------
 * Copyright (c) 2018 by Vy Nguyen
 * BSD License
 *
 * @author vynguyen
 */
package com.tvntd.ether.dao;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import com.tvntd.ether.models.Person;

public interface PersonRepository extends PagingAndSortingRepository<Person, Long> {

	List<Person> findByLastName(@Param("name") String name);

}
