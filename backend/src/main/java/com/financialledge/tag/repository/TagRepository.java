package com.financialledge.tag.repository;

import com.financialledge.tag.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    
    List<Tag> findByUserId(Long userId);
    
    Optional<Tag> findByUserIdAndName(Long userId, String name);
    
    boolean existsByUserIdAndName(Long userId, String name);
    
    // 기존 메서드 (하위 호환성을 위해 유지, 하지만 사용하지 않는 것을 권장)
    @Deprecated
    Optional<Tag> findByName(String name);
}
