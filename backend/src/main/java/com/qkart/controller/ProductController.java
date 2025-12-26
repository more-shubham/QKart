package com.qkart.controller;

import com.qkart.dto.ProductDTO;
import com.qkart.dto.ProductSearchCriteria;
import com.qkart.dto.ProductSearchResponse;
import com.qkart.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductDTO>> getProductsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(@RequestParam String q) {
        return ResponseEntity.ok(productService.searchProducts(q));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        return ResponseEntity.ok(productService.getAllCategories());
    }

    @PostMapping("/search")
    public ResponseEntity<ProductSearchResponse> searchWithFilters(@RequestBody ProductSearchCriteria criteria) {
        return ResponseEntity.ok(productService.searchWithFilters(criteria));
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getSuggestions(@RequestParam String q) {
        return ResponseEntity.ok(productService.getSuggestions(q));
    }

    @GetMapping("/price-range")
    public ResponseEntity<Map<String, BigDecimal>> getPriceRange() {
        return ResponseEntity.ok(Map.of(
            "min", productService.getMinPrice(),
            "max", productService.getMaxPrice()
        ));
    }

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO productDTO) {
        return ResponseEntity.ok(productService.createProduct(productDTO));
    }
}
