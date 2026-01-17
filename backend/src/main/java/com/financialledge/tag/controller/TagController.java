package com.financialledge.tag.controller;

import com.financialledge.auth.repository.UserRepository;
import com.financialledge.tag.entity.Tag;
import com.financialledge.tag.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;
    private final UserRepository userRepository;

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    @GetMapping
    public ResponseEntity<List<Tag>> getAllTags() {
        Long userId = getCurrentUserId();
        List<Tag> tags = tagService.getAllTags(userId);
        return ResponseEntity.ok(tags);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tag> getTagById(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        Tag tag = tagService.getTagById(id, userId);
        return ResponseEntity.ok(tag);
    }

    @PostMapping
    public ResponseEntity<Tag> createTag(@RequestBody Tag tag) {
        Long userId = getCurrentUserId();
        Tag createdTag = tagService.createTag(tag, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTag);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tag> updateTag(
            @PathVariable Long id,
            @RequestBody Tag tag) {
        Long userId = getCurrentUserId();
        Tag updatedTag = tagService.updateTag(id, tag, userId);
        return ResponseEntity.ok(updatedTag);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        tagService.deleteTag(id, userId);
        return ResponseEntity.noContent().build();
    }
}
