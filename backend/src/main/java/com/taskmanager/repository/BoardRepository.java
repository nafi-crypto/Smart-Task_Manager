package com.taskmanager.repository;

import com.taskmanager.model.Board;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends MongoRepository<Board, String> {
    List<Board> findByOwnerId(String ownerId);
    List<Board> findByMemberIdsContaining(String memberId);
}
