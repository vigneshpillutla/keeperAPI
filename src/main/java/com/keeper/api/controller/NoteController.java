package com.keeper.api.controller;

import com.keeper.api.dto.ApiResponse;
import com.keeper.api.dto.NoteDto;
import com.keeper.api.entity.Note;
import com.keeper.api.entity.User;
import com.keeper.api.exception.BadRequestException;
import com.keeper.api.service.NoteService;
import com.keeper.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Security;
import java.util.UUID;

@Controller
@RequestMapping(path = "/api/note")
@RequiredArgsConstructor
public class NoteController {
    private final UserService userService;
    private final NoteService noteService;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> addNote(@RequestBody NoteDto noteDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = (String) authentication.getPrincipal();
        User user = userService.getUserByUsername(username);
        Note newNote = noteService.addNote(noteDto,user);
        return ResponseEntity.ok(ApiResponse.success(newNote));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateNote(@PathVariable("id") UUID id, @RequestBody NoteDto noteDto) {
        Note newNote = noteService.updateNote(id,noteDto);
        return ResponseEntity.ok(ApiResponse.success(newNote));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteNote(@PathVariable("id") UUID id){
        boolean deleted = noteService.deleteNote(id);
        if(deleted){
            return ResponseEntity.ok(ApiResponse.success("Note deleted!"));
        }
        throw new BadRequestException("Note with given id note found!");
    }
}
