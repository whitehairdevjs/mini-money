package com.financialledge.tag.service;

import com.financialledge.tag.entity.Tag;
import com.financialledge.tag.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TagService {

    private final TagRepository tagRepository;

    public List<Tag> getAllTags(Long userId) {
        return tagRepository.findByUserId(userId);
    }

    public Tag getTagById(Long id, Long userId) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found with id: " + id));
        if (!tag.getUserId().equals(userId)) {
            throw new RuntimeException("Tag not found with id: " + id);
        }
        return tag;
    }

    @Transactional
    public Tag createTag(Tag tag, Long userId) {
        if (tagRepository.existsByUserIdAndName(userId, tag.getName())) {
            throw new RuntimeException("Tag with name '" + tag.getName() + "' already exists");
        }
        tag.setUserId(userId);
        return tagRepository.save(tag);
    }

    @Transactional
    public Tag updateTag(Long id, Tag tag, Long userId) {
        Tag existingTag = getTagById(id, userId);
        // 이름이 변경되는 경우 중복 체크
        if (!existingTag.getName().equals(tag.getName()) && 
            tagRepository.existsByUserIdAndName(userId, tag.getName())) {
            throw new RuntimeException("Tag with name '" + tag.getName() + "' already exists");
        }
        existingTag.setName(tag.getName());
        existingTag.setColor(tag.getColor());
        return tagRepository.save(existingTag);
    }

    @Transactional
    public void deleteTag(Long id, Long userId) {
        Tag tag = getTagById(id, userId);
        tagRepository.delete(tag);
    }
}
