package com.taskmanager.controller;

import com.taskmanager.dto.CardDTO;
import com.taskmanager.model.Card;
import com.taskmanager.service.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CardController {

    private final CardService cardService;

    @GetMapping("/columns/{columnId}/cards")
    public ResponseEntity<List<Card>> getCardsByColumn(@PathVariable String columnId) {
        return ResponseEntity.ok(cardService.getCardsByColumnId(columnId));
    }

    @GetMapping("/cards/{id}")
    public ResponseEntity<Card> getCardById(@PathVariable String id) {
        return ResponseEntity.ok(cardService.getCardById(id));
    }

    @PostMapping("/columns/{columnId}/cards")
    public ResponseEntity<Card> createCard(
            @PathVariable String columnId,
            @RequestBody CardDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(cardService.createCard(columnId, dto));
    }

    @PutMapping("/cards/{id}")
    public ResponseEntity<Card> updateCard(
            @PathVariable String id,
            @RequestBody CardDTO dto) {
        return ResponseEntity.ok(cardService.updateCard(id, dto));
    }

    @DeleteMapping("/cards/{id}")
    public ResponseEntity<Void> deleteCard(@PathVariable String id) {
        cardService.deleteCard(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/cards/{id}/comments")
    public ResponseEntity<Card> addComment(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(cardService.addComment(id, body.get("text"), body.get("authorName")));
    }

    @PostMapping("/cards/{id}/checklist")
    public ResponseEntity<Card> addChecklistItem(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(cardService.addChecklistItem(id, body.get("text")));
    }

    @PatchMapping("/cards/{cardId}/checklist/{itemId}/toggle")
    public ResponseEntity<Card> toggleChecklistItem(
            @PathVariable String cardId,
            @PathVariable String itemId) {
        return ResponseEntity.ok(cardService.toggleChecklistItem(cardId, itemId));
    }

    @GetMapping("/boards/{boardId}/cards/search")
    public ResponseEntity<List<Card>> searchCards(
            @PathVariable String boardId,
            @RequestParam String q) {
        return ResponseEntity.ok(cardService.searchCards(boardId, q));
    }
}
