
package com.tvntd.account.dao;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import com.tvntd.account.models.Person;

public interface PersonRepository extends PagingAndSortingRepository<Person, Long> {

	List<Person> findByLastName(@Param("name") String name);

}
