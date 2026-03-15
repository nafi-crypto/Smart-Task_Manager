package com.taskmanager.service;

import com.taskmanager.dto.ColumnDTO;
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
public class ColumnService {

    private final ColumnRepository columnRepository;
    private final BoardRepository boardRepository;
    private final CardRepository cardRepository;

    public List<Column> getColumnsByBoardId(String boardId) {
        return columnRepository.findByBoardIdAndArchivedFalseOrderByPositionAsc(boardId);
    }

    public Column getColumnById(String id) {
        return columnRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Column not found with id: " + id));
    }

    public Column createColumn(String boardId, ColumnDTO dto) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found: " + boardId));

        List<Column> existing = columnRepository.findByBoardIdAndArchivedFalseOrderByPositionAsc(boardId);

        Column column = Column.builder()
                .title(dto.getTitle())
                .boardId(boardId)
                .position(existing.size())
                .color(dto.getColor() != null ? dto.getColor() : "#DFE1E6")
                .cardOrder(new ArrayList<>())
                .archived(false)
                .build();

        Column saved = columnRepository.save(column);

        List<String> columnOrder = board.getColumnOrder();
        if (columnOrder == null) columnOrder = new ArrayList<>();
        columnOrder.add(saved.getId());
        board.setColumnOrder(columnOrder);
        boardRepository.save(board);

        return saved;
    }

    public Column updateColumn(String id, ColumnDTO dto) {
        Column column = getColumnById(id);
        if (dto.getTitle() != null) column.setTitle(dto.getTitle());
        if (dto.getColor() != null) column.setColor(dto.getColor());
        return columnRepository.save(column);
    }

    public void deleteColumn(String id) {
        Column column = getColumnById(id);
        cardRepository.deleteByColumnId(id);

        Board board = boardRepository.findById(column.getBoardId())
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));
        List<String> order = board.getColumnOrder();
        if (order != null) order.remove(id);
        board.setColumnOrder(order);
        boardRepository.save(board);

        columnRepository.deleteById(id);
    }

    public Column updateCardOrder(String columnId, List<String> cardOrder) {
        Column column = getColumnById(columnId);
        column.setCardOrder(cardOrder);
        return columnRepository.save(column);
    }

    public void moveCard(String sourceColumnId, String destColumnId,
                         List<String> sourceCardOrder, List<String> destCardOrder) {
        Column source = getColumnById(sourceColumnId);
        source.setCardOrder(sourceCardOrder);
        columnRepository.save(source);

        Column dest = getColumnById(destColumnId);
        dest.setCardOrder(destCardOrder);
        columnRepository.save(dest);

        // Update card's columnId
        String movedCardId = destCardOrder.stream()
                .filter(id -> !source.getCardOrder().contains(id))
                .findFirst()
                .orElse(null);

        if (movedCardId != null) {
            cardRepository.findById(movedCardId).ifPresent(card -> {
                card.setColumnId(destColumnId);
                cardRepository.save(card);
            });
        }
    }
}
