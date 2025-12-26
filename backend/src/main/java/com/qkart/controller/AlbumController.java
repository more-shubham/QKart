package com.qkart.controller;

import com.qkart.dto.AlbumDTO;
import com.qkart.dto.SongDTO;
import com.qkart.service.AlbumService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/albums")
@RequiredArgsConstructor
public class AlbumController {

    private final AlbumService albumService;

    @GetMapping
    public ResponseEntity<List<AlbumDTO>> getAllAlbums() {
        return ResponseEntity.ok(albumService.getAllAlbums());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlbumDTO> getAlbumById(@PathVariable Long id) {
        return ResponseEntity.ok(albumService.getAlbumById(id));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<AlbumDTO>> getFeaturedAlbums() {
        return ResponseEntity.ok(albumService.getFeaturedAlbums());
    }

    @GetMapping("/top")
    public ResponseEntity<List<AlbumDTO>> getTopAlbums() {
        return ResponseEntity.ok(albumService.getTopAlbums());
    }

    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<AlbumDTO>> getAlbumsByGenre(@PathVariable String genre) {
        return ResponseEntity.ok(albumService.getAlbumsByGenre(genre));
    }

    @GetMapping("/search")
    public ResponseEntity<List<AlbumDTO>> searchAlbums(@RequestParam String q) {
        return ResponseEntity.ok(albumService.searchAlbums(q));
    }

    @GetMapping("/genres")
    public ResponseEntity<List<String>> getAllGenres() {
        return ResponseEntity.ok(albumService.getAllGenres());
    }

    @GetMapping("/{albumId}/songs")
    public ResponseEntity<List<SongDTO>> getSongsByAlbum(@PathVariable Long albumId) {
        return ResponseEntity.ok(albumService.getSongsByAlbumId(albumId));
    }

    @GetMapping("/songs/top")
    public ResponseEntity<List<SongDTO>> getTopSongs() {
        return ResponseEntity.ok(albumService.getTopSongs());
    }

    @GetMapping("/songs/search")
    public ResponseEntity<List<SongDTO>> searchSongs(@RequestParam String q) {
        return ResponseEntity.ok(albumService.searchSongs(q));
    }
}
