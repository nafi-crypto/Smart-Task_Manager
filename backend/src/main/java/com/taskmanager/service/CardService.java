package com.taskmanager.service;

import com.taskmanager.dto.CardDTO;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.model.Card;
import com.taskmanager.model.Column;
import com.taskmanager.repository.CardRepository;
import com.taskmanager.repository.ColumnRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final ColumnRepository columnRepository;

    public List<Card> getCardsByColumnId(String columnId) {
        return cardRepository.findByColumnIdAndArchivedFalseOrderByPositionAsc(columnId);
    }

    public Card getCardById(String id) {
        return cardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found with id: " + id));
    }

    public Card createCard(String columnId, CardDTO dto) {
        Column column = columnRepository.findById(columnId)
                .orElseThrow(() -> new ResourceNotFoundException("Column not found: " + columnId));

        List<Card> existing = cardRepository.findByColumnIdAndArchivedFalseOrderByPositionAsc(columnId);

        Card card = Card.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .columnId(columnId)
                .boardId(column.getBoardId())
                .priority(dto.getPriority() != null ? dto.getPriority() : Card.Priority.MEDIUM)
                .labels(dto.getLabels() != null ? dto.getLabels() : new ArrayList<>())
                .assigneeIds(dto.getAssigneeIds() != null ? dto.getAssigneeIds() : new ArrayList<>())
                .checklist(new ArrayList<>())
                .attachments(new ArrayList<>())
                .comments(new ArrayList<>())
                .dueDate(dto.getDueDate())
                .coverColor(dto.getCoverColor())
                .archived(false)
                .position(existing.size())
                .build();

        Card saved = cardRepository.save(card);

        List<String> cardOrder = column.getCardOrder();
        if (cardOrder == null) cardOrder = new ArrayList<>();
        cardOrder.add(saved.getId());
        column.setCardOrder(cardOrder);
        columnRepository.save(column);

        return saved;
    }

    public Card updateCard(String id, CardDTO dto) {
        Card card = getCardById(id);
        if (dto.getTitle() != null) card.setTitle(dto.getTitle());
        if (dto.getDescription() != null) card.setDescription(dto.getDescription());
        if (dto.getPriority() != null) card.setPriority(dto.getPriority());
        if (dto.getLabels() != null) card.setLabels(dto.getLabels());
        if (dto.getAssigneeIds() != null) card.setAssigneeIds(dto.getAssigneeIds());
        if (dto.getDueDate() != null) card.setDueDate(dto.getDueDate());
        if (dto.getCoverColor() != null) card.setCoverColor(dto.getCoverColor());
        if (dto.getChecklist() != null) card.setChecklist(dto.getChecklist());
        return cardRepository.save(card);
    }

    public void deleteCard(String id) {
        Card card = getCardById(id);
        columnRepository.findById(card.getColumnId()).ifPresent(column -> {
            List<String> order = column.getCardOrder();
            if (order != null) order.remove(id);
            column.setCardOrder(order);
            columnRepository.save(column);
        });
        cardRepository.deleteById(id);
    }

    public Card addComment(String cardId, String text, String authorName) {
        Card card = getCardById(cardId);
        Card.Comment comment = new Card.Comment(
                UUID.randomUUID().toString(),
                text,
                "user-1",
                authorName,
                LocalDateTime.now()
        );
        if (card.getComments() == null) card.setComments(new ArrayList<>());
        card.getComments().add(comment);
        return cardRepository.save(card);
    }

    public Card toggleChecklistItem(String cardId, String itemId) {
        Card card = getCardById(cardId);
        if (card.getChecklist() != null) {
            card.getChecklist().forEach(item -> {
                if (item.getId().equals(itemId)) {
                    item.setCompleted(!item.isCompleted());
                }
            });
        }
        return cardRepository.save(card);
    }

    public Card addChecklistItem(String cardId, String text) {
        Card card = getCardById(cardId);
        Card.ChecklistItem item = new Card.ChecklistItem(
                UUID.randomUUID().toString(), text, false
        );
        if (card.getChecklist() == null) card.setChecklist(new ArrayList<>());
        card.getChecklist().add(item);
        return cardRepository.save(card);
    }

    public List<Card> searchCards(String boardId, String query) {
        return cardRepository.findByBoardIdAndTitleContainingIgnoreCase(boardId, query);
    }
}
