package com.taskmanager.service;

import com.taskmanager.dto.BoardDTO;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.model.Board;
import com.taskmanager.model.Column;
import com.taskmanager.repository.BoardRepository;
import com.taskmanager.repository.CardRepository;
import com.taskmanager.repository.ColumnRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final ColumnRepository columnRepository;
    private final CardRepository cardRepository;

    public List<Board> getAllBoards() {
        return boardRepository.findAll();
    }

    public Board getBoardById(String id) {
        return boardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found with id: " + id));
    }

    public Board createBoard(BoardDTO dto) {
        Board board = Board.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .backgroundColor(dto.getBackgroundColor() != null ? dto.getBackgroundColor() : "#0052CC")
                .backgroundImage(dto.getBackgroundImage())
                .ownerId(dto.getOwnerId() != null ? dto.getOwnerId() : "default-user")
                .memberIds(dto.getMemberIds() != null ? dto.getMemberIds() : new ArrayList<>())
                .columnOrder(new ArrayList<>())
                .build();

        Board savedBoard = boardRepository.save(board);

        // Create default columns
        createDefaultColumns(savedBoard.getId());

        return getBoardById(savedBoard.getId());
    }

    private void createDefaultColumns(String boardId) {
        String[] defaultColumns = {"To Do", "In Progress", "In Review", "Done"};
        String[] columnColors = {"#DFE1E6", "#0052CC", "#FF8B00", "#00875A"};

        List<String> columnOrder = new ArrayList<>();

        for (int i = 0; i < defaultColumns.length; i++) {
            Column column = Column.builder()
                    .title(defaultColumns[i])
                    .boardId(boardId)
                    .position(i)
                    .color(columnColors[i])
                    .cardOrder(new ArrayList<>())
                    .archived(false)
                    .build();
            Column saved = columnRepository.save(column);
            columnOrder.add(saved.getId());
        }

        Board board = getBoardById(boardId);
        board.setColumnOrder(columnOrder);
        boardRepository.save(board);
    }

    public Board updateBoard(String id, BoardDTO dto) {
        Board board = getBoardById(id);
        if (dto.getTitle() != null) board.setTitle(dto.getTitle());
        if (dto.getDescription() != null) board.setDescription(dto.getDescription());
        if (dto.getBackgroundColor() != null) board.setBackgroundColor(dto.getBackgroundColor());
        if (dto.getBackgroundImage() != null) board.setBackgroundImage(dto.getBackgroundImage());
        return boardRepository.save(board);
    }

    public void deleteBoard(String id) {
        getBoardById(id);
        // Delete all columns and cards
        List<Column> columns = columnRepository.findByBoardId(id);
        for (Column column : columns) {
            cardRepository.deleteByColumnId(column.getId());
        }
        columnRepository.deleteByBoardId(id);
        boardRepository.deleteById(id);
    }

    public Board updateColumnOrder(String boardId, List<String> columnOrder) {
        Board board = getBoardById(boardId);
        board.setColumnOrder(columnOrder);
        return boardRepository.save(board);
    }
}
