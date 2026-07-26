package com.example.noticeboard.controller;

import com.example.noticeboard.model.Notice;
import com.example.noticeboard.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
@CrossOrigin(origins = "*") // Allows your future frontend to talk to this backend
public class NoticeController {

    private final NoticeRepository noticeRepository;

    // Injecting the password from application.properties / .env
    @Value("${app.admin.password}")
    private String adminPassword;

    public NoticeController(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    // 1. PUBLIC: Get all notices
    @GetMapping
    public List<Notice> getAllNotices() {
        return noticeRepository.findAll();
    }

    // 2. PROTECTED: Create a notice
    @PostMapping
    public ResponseEntity<?> createNotice(
            @RequestHeader(value = "X-Admin-Password", required = false) String inputPassword,
            @RequestBody Notice notice) {

        if (!adminPassword.equals(inputPassword)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: Invalid Admin Password");
        }

        Notice savedNotice = noticeRepository.save(notice);
        return new ResponseEntity<>(savedNotice, HttpStatus.CREATED);
    }

    // 3. PROTECTED: Delete a notice
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotice(
            @RequestHeader(value = "X-Admin-Password", required = false) String inputPassword,
            @PathVariable Long id) {

        if (!adminPassword.equals(inputPassword)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: Invalid Admin Password");
        }

        if (!noticeRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Notice not found");
        }

        noticeRepository.deleteById(id);
        return ResponseEntity.ok("Notice deleted successfully");
    }
}