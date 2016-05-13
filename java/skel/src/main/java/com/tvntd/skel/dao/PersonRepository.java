
package com.tvntd.skel.dao;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import com.tvntd.skel.models.Person;

public interface PersonRepository extends PagingAndSortingRepository<Person, Long> {

	List<Person> findByLastName(@Param("name") String name);

}
