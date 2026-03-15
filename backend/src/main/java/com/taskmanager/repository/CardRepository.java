package com.taskmanager.repository;

import com.taskmanager.model.Card;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardRepository extends MongoRepository<Card, String> {
    List<Card> findByColumnIdAndArchivedFalseOrderByPositionAsc(String columnId);
    List<Card> findByBoardId(String boardId);
    List<Card> findByColumnId(String columnId);
    void deleteByColumnId(String columnId);
    void deleteByBoardId(String boardId);
    List<Card> findByBoardIdAndTitleContainingIgnoreCase(String boardId, String title);
}
