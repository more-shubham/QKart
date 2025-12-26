package com.qkart.service;

import com.qkart.dto.ProductDTO;
import com.qkart.dto.ProductSearchCriteria;
import com.qkart.dto.ProductSearchResponse;
import com.qkart.model.Product;
import com.qkart.repository.ProductRepository;
import com.qkart.specification.ProductSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long id) {
        return productRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public List<ProductDTO> getProductsByCategory(String category) {
        return productRepository.findByCategory(category).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> searchProducts(String query) {
        return productRepository.searchProducts(query).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<String> getAllCategories() {
        return productRepository.findAllCategories();
    }

    public ProductSearchResponse searchWithFilters(ProductSearchCriteria criteria) {
        // Default pagination
        int page = criteria.getPage() != null ? criteria.getPage() : 0;
        int size = criteria.getSize() != null ? criteria.getSize() : 12;

        // Build sort
        Sort sort = buildSort(criteria.getSortBy(), criteria.getSortOrder());
        Pageable pageable = PageRequest.of(page, size, sort);

        // Execute search with specification
        Page<Product> productPage = productRepository.findAll(
            ProductSpecification.withCriteria(criteria),
            pageable
        );

        return ProductSearchResponse.builder()
            .products(productPage.getContent().stream().map(this::toDTO).collect(Collectors.toList()))
            .currentPage(productPage.getNumber())
            .totalPages(productPage.getTotalPages())
            .totalElements(productPage.getTotalElements())
            .pageSize(productPage.getSize())
            .hasNext(productPage.hasNext())
            .hasPrevious(productPage.hasPrevious())
            .build();
    }

    private Sort buildSort(String sortBy, String sortOrder) {
        if (sortBy == null || sortBy.isEmpty()) {
            return Sort.by(Sort.Direction.ASC, "name");
        }

        Sort.Direction direction = "desc".equalsIgnoreCase(sortOrder)
            ? Sort.Direction.DESC
            : Sort.Direction.ASC;

        return switch (sortBy.toLowerCase()) {
            case "price" -> Sort.by(direction, "price");
            case "rating" -> Sort.by(Sort.Direction.DESC, "rating"); // Always desc for rating
            case "newest" -> Sort.by(Sort.Direction.DESC, "id"); // Assuming higher ID = newer
            case "name" -> Sort.by(direction, "name");
            default -> Sort.by(Sort.Direction.ASC, "name");
        };
    }

    public List<String> getSuggestions(String query) {
        if (query == null || query.trim().length() < 2) {
            return List.of();
        }
        return productRepository.findSuggestions(query).stream()
            .map(Product::getName)
            .collect(Collectors.toList());
    }

    public BigDecimal getMinPrice() {
        BigDecimal min = productRepository.findMinPrice();
        return min != null ? min : BigDecimal.ZERO;
    }

    public BigDecimal getMaxPrice() {
        BigDecimal max = productRepository.findMaxPrice();
        return max != null ? max : BigDecimal.valueOf(10000);
    }

    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = toEntity(productDTO);
        Product saved = productRepository.save(product);
        return toDTO(saved);
    }

    private ProductDTO toDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .category(product.getCategory())
                .imageUrl(product.getImageUrl())
                .stock(product.getStock())
                .rating(product.getRating())
                .reviewCount(product.getReviewCount())
                .build();
    }

    private Product toEntity(ProductDTO dto) {
        return Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .category(dto.getCategory())
                .imageUrl(dto.getImageUrl())
                .stock(dto.getStock())
                .rating(dto.getRating())
                .reviewCount(dto.getReviewCount())
                .build();
    }
}
