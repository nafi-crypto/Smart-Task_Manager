package com.taskmanager.controller;

import com.taskmanager.dto.ColumnDTO;
import com.taskmanager.model.Column;
import com.taskmanager.service.ColumnService;
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
public class ColumnController {

    private final ColumnService columnService;

    @GetMapping("/boards/{boardId}/columns")
    public ResponseEntity<List<Column>> getColumnsByBoard(@PathVariable String boardId) {
        return ResponseEntity.ok(columnService.getColumnsByBoardId(boardId));
    }

    @PostMapping("/boards/{boardId}/columns")
    public ResponseEntity<Column> createColumn(
            @PathVariable String boardId,
            @RequestBody ColumnDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(columnService.createColumn(boardId, dto));
    }

    @PutMapping("/columns/{id}")
    public ResponseEntity<Column> updateColumn(
            @PathVariable String id,
            @RequestBody ColumnDTO dto) {
        return ResponseEntity.ok(columnService.updateColumn(id, dto));
    }

    @DeleteMapping("/columns/{id}")
    public ResponseEntity<Void> deleteColumn(@PathVariable String id) {
        columnService.deleteColumn(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/columns/{id}/card-order")
    public ResponseEntity<Column> updateCardOrder(
            @PathVariable String id,
            @RequestBody Map<String, List<String>> body) {
        return ResponseEntity.ok(columnService.updateCardOrder(id, body.get("cardOrder")));
    }

    @PostMapping("/columns/move-card")
    public ResponseEntity<Void> moveCard(@RequestBody Map<String, Object> body) {
        String sourceColumnId = (String) body.get("sourceColumnId");
        String destColumnId = (String) body.get("destColumnId");
        @SuppressWarnings("unchecked")
        List<String> sourceCardOrder = (List<String>) body.get("sourceCardOrder");
        @SuppressWarnings("unchecked")
        List<String> destCardOrder = (List<String>) body.get("destCardOrder");
        columnService.moveCard(sourceColumnId, destColumnId, sourceCardOrder, destCardOrder);
        return ResponseEntity.ok().build();
    }
}
