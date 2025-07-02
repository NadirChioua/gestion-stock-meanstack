import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <h1>Tableau de Bord</h1>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon products">📦</div>
          <div class="stat-content">
            <h3>{{ stats.totalProducts || 0 }}</h3>
            <p>Produits Total</p>
          </div>
        </div>
        
        <div class="stat-card warning" *ngIf="stats.lowStockProducts > 0">
          <div class="stat-icon low-stock">⚠️</div>
          <div class="stat-content">
            <h3>{{ stats.lowStockProducts }}</h3>
            <p>Stock Faible</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon value">💰</div>
          <div class="stat-content">
            <h3>{{ (stats.totalValue || 0) | currency:'EUR':'symbol':'1.0-0' }}</h3>
            <p>Valeur Totale</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon movements">📊</div>
          <div class="stat-content">
            <h3>{{ recentMovements.length }}</h3>
            <p>Mouvements Récents</p>
          </div>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="section">
          <h2>Catégories de Produits</h2>
          <div class="category-list" *ngIf="stats.categoryStats">
            <div class="category-item" *ngFor="let category of stats.categoryStats">
              <span class="category-name">{{ category._id }}</span>
              <span class="category-count">{{ category.count }} produits</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Mouvements Récents</h2>
          <div class="movements-list">
            <div class="movement-item" *ngFor="let movement of recentMovements">
              <div class="movement-info">
                <span class="product-name">{{ movement.produitId?.nom }}</span>
                <span class="movement-type" [class]="movement.typeMouvement">
                  {{ movement.typeMouvement | titlecase }}
                </span>
              </div>
              <div class="movement-details">
                <span class="quantity">{{ movement.quantiteMouvement > 0 ? '+' : '' }}{{ movement.quantiteMouvement }}</span>
                <span class="date">{{ movement.createdAt | date:'short' }}</span>
              </div>
            </div>
            <div class="no-data" *ngIf="recentMovements.length === 0">
              Aucun mouvement récent
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h2>Actions Rapides</h2>
          <div class="action-buttons">
            <button class="action-btn primary" routerLink="/products">
              <span class="btn-icon">📦</span>
              Gérer les Produits
            </button>
            <button class="action-btn secondary" routerLink="/stock">
              <span class="btn-icon">📊</span>
              Voir les Mouvements
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  stats: any = {};
  recentMovements: any[] = [];
  isLoading = true;

  constructor(
    private productService: ProductService,
    private stockService: StockService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Charger les statistiques des produits
    this.productService.getProductStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.stats = response.data;
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    });

    // Charger les mouvements récents
    this.stockService.getMovements({ limit: 10 }).subscribe({
      next: (response) => {
        if (response.success) {
          this.recentMovements = response.data.movements;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des mouvements:', error);
        this.isLoading = false;
      }
    });
  }
}

