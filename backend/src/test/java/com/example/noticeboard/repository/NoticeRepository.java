package com.example.noticeboard.repository;

import com.example.noticeboard.model.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    // JpaRepository gives us findAll(), findById(), save(), and deleteById() out of the box.
}