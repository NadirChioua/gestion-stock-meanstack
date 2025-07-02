import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService, StockMovement } from '../../services/stock.service';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="stock-container">
      <div class="header">
        <h1>Gestion des Mouvements de Stock</h1>
        <button class="add-btn" (click)="showAddForm = !showAddForm">
          {{ showAddForm ? 'Annuler' : 'Nouveau Mouvement' }}
        </button>
      </div>

      <!-- Formulaire d'ajout de mouvement -->
      <div class="form-container" *ngIf="showAddForm">
        <h3>Nouveau Mouvement de Stock</h3>
        <form (ngSubmit)="onSubmit()" #movementForm="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label for="produitId">Produit *</label>
              <select
                id="produitId"
                name="produitId"
                [(ngModel)]="currentMovement.produitId"
                required
                class="form-control"
              >
                <option value="">Sélectionner un produit</option>
                <option *ngFor="let product of products" [value]="product._id">
                  {{ product.nom }} ({{ product.sku }}) - Stock: {{ product.quantite }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="typeMouvement">Type de Mouvement *</label>
              <select
                id="typeMouvement"
                name="typeMouvement"
                [(ngModel)]="currentMovement.typeMouvement"
                required
                class="form-control"
              >
                <option value="">Sélectionner un type</option>
                <option value="entrée">Entrée</option>
                <option value="sortie">Sortie</option>
                <option value="ajustement">Ajustement</option>
                <option value="retour">Retour</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="quantiteMouvement">Quantité *</label>
              <input
                type="number"
                id="quantiteMouvement"
                name="quantiteMouvement"
                [(ngModel)]="currentMovement.quantiteMouvement"
                required
                min="1"
                class="form-control"
              >
            </div>
            <div class="form-group">
              <label for="numeroCommande">Numéro de Commande</label>
              <input
                type="text"
                id="numeroCommande"
                name="numeroCommande"
                [(ngModel)]="currentMovement.numeroCommande"
                class="form-control"
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="fournisseur">Fournisseur</label>
              <input
                type="text"
                id="fournisseur"
                name="fournisseur"
                [(ngModel)]="currentMovement.fournisseur"
                class="form-control"
              >
            </div>
          </div>

          <div class="form-group">
            <label for="motif">Motif</label>
            <textarea
              id="motif"
              name="motif"
              [(ngModel)]="currentMovement.motif"
              rows="3"
              class="form-control"
              placeholder="Raison du mouvement de stock..."
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="save-btn" [disabled]="movementForm.invalid || isLoading">
              {{ isLoading ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
            <button type="button" class="cancel-btn" (click)="cancelForm()">
              Annuler
            </button>
          </div>
        </form>
      </div>

      <!-- Filtres -->
      <div class="filters">
        <div class="filter-group">
          <select [(ngModel)]="selectedProduct" (change)="onProductFilter()" class="filter-select">
            <option value="">Tous les produits</option>
            <option *ngFor="let product of products" [value]="product._id">
              {{ product.nom }} ({{ product.sku }})
            </option>
          </select>
        </div>
        <div class="filter-group">
          <select [(ngModel)]="selectedType" (change)="onTypeFilter()" class="filter-select">
            <option value="">Tous les types</option>
            <option value="entrée">Entrée</option>
            <option value="sortie">Sortie</option>
            <option value="ajustement">Ajustement</option>
            <option value="retour">Retour</option>
          </select>
        </div>
        <div class="filter-group">
          <input
            type="date"
            [(ngModel)]="dateDebut"
            (change)="onDateFilter()"
            class="filter-input"
            placeholder="Date début"
          >
        </div>
        <div class="filter-group">
          <input
            type="date"
            [(ngModel)]="dateFin"
            (change)="onDateFilter()"
            class="filter-input"
            placeholder="Date fin"
          >
        </div>
      </div>

      <!-- Liste des mouvements -->
      <div class="movements-list">
        <div class="movement-card" *ngFor="let movement of movements">
          <div class="movement-header">
            <div class="product-info">
              <h3>{{ movement.produitId?.nom }}</h3>
              <span class="sku">{{ movement.produitId?.sku }}</span>
            </div>
            <div class="movement-type" [class]="movement.typeMouvement">
              {{ movement.typeMouvement | titlecase }}
            </div>
          </div>

          <div class="movement-details">
            <div class="detail-row">
              <span class="label">Quantité:</span>
              <span class="value quantity" [class.positive]="movement.quantiteMouvement > 0" [class.negative]="movement.quantiteMouvement < 0">
                {{ movement.quantiteMouvement > 0 ? '+' : '' }}{{ movement.quantiteMouvement }}
              </span>
            </div>
            <div class="detail-row">
              <span class="label">Stock avant:</span>
              <span class="value">{{ movement.quantiteAvant }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Stock après:</span>
              <span class="value">{{ movement.quantiteApres }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Date:</span>
              <span class="value">{{ movement.createdAt | date:'medium' }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Utilisateur:</span>
              <span class="value">{{ movement.utilisateur?.nom }}</span>
            </div>
            <div class="detail-row" *ngIf="movement.numeroCommande">
              <span class="label">N° Commande:</span>
              <span class="value">{{ movement.numeroCommande }}</span>
            </div>
            <div class="detail-row" *ngIf="movement.fournisseur">
              <span class="label">Fournisseur:</span>
              <span class="value">{{ movement.fournisseur }}</span>
            </div>
            <div class="detail-row" *ngIf="movement.motif">
              <span class="label">Motif:</span>
              <span class="value">{{ movement.motif }}</span>
            </div>
          </div>
        </div>

        <div class="no-data" *ngIf="movements.length === 0 && !isLoading">
          Aucun mouvement trouvé
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
  styleUrl: './stock.css'
})
export class StockComponent implements OnInit {
  movements: StockMovement[] = [];
  products: Product[] = [];
  currentMovement: any = {};
  showAddForm = false;
  isLoading = false;
  errorMessage = '';
  
  selectedProduct = '';
  selectedType = '';
  dateDebut = '';
  dateFin = '';
  
  pagination = {
    currentPage: 1,
    totalPages: 1,
    totalMovements: 0,
    hasNext: false,
    hasPrev: false
  };

  constructor(
    private stockService: StockService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadMovements();
  }

  loadProducts() {
    this.productService.getProducts({ limit: 1000 }).subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.data.products;
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des produits:', error);
      }
    });
  }

  loadMovements() {
    const params: any = {
      page: this.pagination.currentPage,
      limit: 10
    };

    if (this.selectedProduct) params.produitId = this.selectedProduct;
    if (this.selectedType) params.typeMouvement = this.selectedType;
    if (this.dateDebut) params.dateDebut = this.dateDebut;
    if (this.dateFin) params.dateFin = this.dateFin;

    this.stockService.getMovements(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.movements = response.data.movements;
          this.pagination = response.data.pagination;
        }
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des mouvements';
        console.error(error);
      }
    });
  }

  onSubmit() {
    this.isLoading = true;
    this.stockService.createMovement(this.currentMovement).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadMovements();
          this.loadProducts(); // Recharger pour mettre à jour les quantités
          this.cancelForm();
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors de la création du mouvement';
        this.isLoading = false;
      }
    });
  }

  cancelForm() {
    this.showAddForm = false;
    this.currentMovement = {};
    this.errorMessage = '';
  }

  onProductFilter() {
    this.pagination.currentPage = 1;
    this.loadMovements();
  }

  onTypeFilter() {
    this.pagination.currentPage = 1;
    this.loadMovements();
  }

  onDateFilter() {
    this.pagination.currentPage = 1;
    this.loadMovements();
  }

  changePage(page: number) {
    this.pagination.currentPage = page;
    this.loadMovements();
  }
}

