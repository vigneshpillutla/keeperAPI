package com.keeper.api.service;

import com.keeper.api.dto.NoteDto;
import com.keeper.api.entity.Note;
import com.keeper.api.entity.User;
import com.keeper.api.exception.BadRequestException;
import com.keeper.api.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NoteService {
    private final NoteRepository noteRepository;

    public Note addNote(NoteDto note, User user){
        Note newNote = Note.builder()
                .title(note.getTitle())
                .content(note.getContent())
                .user(user)
                .build();
        noteRepository.save(newNote);
        return newNote;
    }

    public Note updateNote(UUID id, NoteDto noteDto){
        Note note = noteRepository.findById(id).orElseThrow(() -> new BadRequestException("Note note found"));
        note.setTitle(noteDto.getTitle());
        note.setContent(note.getContent());
        noteRepository.save(note);
        return note;
    }

    public boolean deleteNote(UUID id){
        if (noteRepository.existsById(id)){
            noteRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
