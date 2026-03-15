package com.taskmanager.controller;

import com.taskmanager.dto.BoardDTO;
import com.taskmanager.model.Board;
import com.taskmanager.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class BoardController {

    private final BoardService boardService;

    @GetMapping
    public ResponseEntity<List<Board>> getAllBoards() {
        return ResponseEntity.ok(boardService.getAllBoards());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Board> getBoardById(@PathVariable String id) {
        return ResponseEntity.ok(boardService.getBoardById(id));
    }

    @PostMapping
    public ResponseEntity<Board> createBoard(@RequestBody BoardDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(boardService.createBoard(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Board> updateBoard(@PathVariable String id, @RequestBody BoardDTO dto) {
        return ResponseEntity.ok(boardService.updateBoard(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable String id) {
        boardService.deleteBoard(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/column-order")
    public ResponseEntity<Board> updateColumnOrder(
            @PathVariable String id,
            @RequestBody Map<String, List<String>> body) {
        return ResponseEntity.ok(boardService.updateColumnOrder(id, body.get("columnOrder")));
    }
}
