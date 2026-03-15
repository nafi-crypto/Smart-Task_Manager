package com.taskmanager.repository;

import com.taskmanager.model.Column;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ColumnRepository extends MongoRepository<Column, String> {
    List<Column> findByBoardIdAndArchivedFalseOrderByPositionAsc(String boardId);
    List<Column> findByBoardId(String boardId);
    void deleteByBoardId(String boardId);
}
