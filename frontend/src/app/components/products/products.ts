import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="products-container">
      <div class="header">
        <h1>Gestion des Produits</h1>
        <button class="add-btn" (click)="showAddForm = !showAddForm">
          {{ showAddForm ? 'Annuler' : 'Ajouter un Produit' }}
        </button>
      </div>

      <!-- Formulaire d'ajout/modification -->
      <div class="form-container" *ngIf="showAddForm || editingProduct">
        <h3>{{ editingProduct ? 'Modifier le Produit' : 'Nouveau Produit' }}</h3>
        <form (ngSubmit)="onSubmit()" #productForm="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label for="nom">Nom *</label>
              <input
                type="text"
                id="nom"
                name="nom"
                [(ngModel)]="currentProduct.nom"
                required
                class="form-control"
              >
            </div>
            <div class="form-group">
              <label for="sku">SKU *</label>
              <input
                type="text"
                id="sku"
                name="sku"
                [(ngModel)]="currentProduct.sku"
                required
                class="form-control"
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="prix">Prix *</label>
              <input
                type="number"
                id="prix"
                name="prix"
                [(ngModel)]="currentProduct.prix"
                required
                min="0"
                step="0.01"
                class="form-control"
              >
            </div>
            <div class="form-group">
              <label for="quantite">Quantité *</label>
              <input
                type="number"
                id="quantite"
                name="quantite"
                [(ngModel)]="currentProduct.quantite"
                required
                min="0"
                class="form-control"
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="categorie">Catégorie *</label>
              <select
                id="categorie"
                name="categorie"
                [(ngModel)]="currentProduct.categorie"
                required
                class="form-control"
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="Électronique">Électronique</option>
                <option value="Vêtements">Vêtements</option>
                <option value="Alimentaire">Alimentaire</option>
                <option value="Mobilier">Mobilier</option>
                <option value="Livres">Livres</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div class="form-group">
              <label for="seuilMinimum">Seuil Minimum</label>
              <input
                type="number"
                id="seuilMinimum"
                name="seuilMinimum"
                [(ngModel)]="currentProduct.seuilMinimum"
                min="0"
                class="form-control"
              >
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              name="description"
              [(ngModel)]="currentProduct.description"
              rows="3"
              class="form-control"
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="save-btn" [disabled]="productForm.invalid || isLoading">
              {{ isLoading ? 'Enregistrement...' : (editingProduct ? 'Modifier' : 'Ajouter') }}
            </button>
            <button type="button" class="cancel-btn" (click)="cancelForm()">
              Annuler
            </button>
          </div>
        </form>
      </div>

      <!-- Filtres et recherche -->
      <div class="filters">
        <div class="search-group">
          <input
            type="text"
            placeholder="Rechercher par nom, SKU..."
            [(ngModel)]="searchTerm"
            (input)="onSearch()"
            class="search-input"
          >
        </div>
        <div class="filter-group">
          <select [(ngModel)]="selectedCategory" (change)="onCategoryFilter()" class="filter-select">
            <option value="">Toutes les catégories</option>
            <option value="Électronique">Électronique</option>
            <option value="Vêtements">Vêtements</option>
            <option value="Alimentaire">Alimentaire</option>
            <option value="Mobilier">Mobilier</option>
            <option value="Livres">Livres</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
        <div class="filter-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              [(ngModel)]="showLowStock"
              (change)="onLowStockFilter()"
            >
            Stock faible uniquement
          </label>
        </div>
      </div>

      <!-- Liste des produits -->
      <div class="products-grid">
        <div class="product-card" *ngFor="let product of products" [class.low-stock]="product.stockFaible">
          <div class="product-header">
            <h3>{{ product.nom }}</h3>
            <span class="sku">{{ product.sku }}</span>
          </div>
          
          <div class="product-info">
            <div class="info-row">
              <span class="label">Catégorie:</span>
              <span class="value">{{ product.categorie }}</span>
            </div>
            <div class="info-row">
              <span class="label">Prix:</span>
              <span class="value">{{ product.prix | currency:'EUR':'symbol':'1.2-2' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Quantité:</span>
              <span class="value" [class.warning]="product.stockFaible">{{ product.quantite }}</span>
            </div>
            <div class="info-row" *ngIf="product.description">
              <span class="label">Description:</span>
              <span class="value">{{ product.description }}</span>
            </div>
          </div>

          <div class="product-actions">
            <button class="edit-btn" (click)="editProduct(product)">Modifier</button>
            <button class="delete-btn" (click)="deleteProduct(product._id)">Supprimer</button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="pagination.totalPages > 1">
        <button
          class="page-btn"
          [disabled]="!pagination.hasPrev"
          (click)="changePage(pagination.currentPage - 1)"
        >
          Précédent
        </button>
        
        <span class="page-info">
          Page {{ pagination.currentPage }} sur {{ pagination.totalPages }}
        </span>
        
        <button
          class="page-btn"
          [disabled]="!pagination.hasNext"
          (click)="changePage(pagination.currentPage + 1)"
        >
          Suivant
        </button>
      </div>

      <!-- Message d'erreur -->
      <div class="error-message" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styleUrl: './products.css'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  currentProduct: Partial<Product> = {};
  editingProduct: Product | null = null;
  showAddForm = false;
  isLoading = false;
  errorMessage = '';
  
  searchTerm = '';
  selectedCategory = '';
  showLowStock = false;
  
  pagination = {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNext: false,
    hasPrev: false
  };

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    const params = {
      page: this.pagination.currentPage,
      limit: 12,
      search: this.searchTerm || undefined,
      categorie: this.selectedCategory || undefined,
      stockFaible: this.showLowStock || undefined
    };

    this.productService.getProducts(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.data.products;
          this.pagination = response.data.pagination;
        }
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des produits';
        console.error(error);
      }
    });
  }

  onSubmit() {
    if (this.editingProduct) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }

  createProduct() {
    this.isLoading = true;
    this.productService.createProduct(this.currentProduct).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadProducts();
          this.cancelForm();
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors de la création';
        this.isLoading = false;
      }
    });
  }

  updateProduct() {
    if (this.editingProduct) {
      this.isLoading = true;
      this.productService.updateProduct(this.editingProduct._id, this.currentProduct).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadProducts();
            this.cancelForm();
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la modification';
          this.isLoading = false;
        }
      });
    }
  }

  editProduct(product: Product) {
    this.editingProduct = product;
    this.currentProduct = { ...product };
    this.showAddForm = false;
  }

  deleteProduct(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.productService.deleteProduct(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadProducts();
          }
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la suppression';
        }
      });
    }
  }

  cancelForm() {
    this.showAddForm = false;
    this.editingProduct = null;
    this.currentProduct = {};
    this.errorMessage = '';
  }

  onSearch() {
    this.pagination.currentPage = 1;
    this.loadProducts();
  }

  onCategoryFilter() {
    this.pagination.currentPage = 1;
    this.loadProducts();
  }

  onLowStockFilter() {
    this.pagination.currentPage = 1;
    this.loadProducts();
  }

  changePage(page: number) {
    this.pagination.currentPage = page;
    this.loadProducts();
  }
}

