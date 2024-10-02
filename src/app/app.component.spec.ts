import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test de création du composant
  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  // Test d'initialisation ou de réinitialisation du jeu
  it('should initialize or reset the game correctly', () => {
    component.initOrResetGame();
    expect(component.grid.length).toBe(6); // Vérifie que la grille a bien 6 lignes
    expect(component.grid[0].length).toBe(7); // Vérifie que chaque ligne a 7 colonnes
    // Le joueur devrait être 1 ou 2
    expect(component.currentPlayer).toBeGreaterThanOrEqual(1); 
    expect(component.currentPlayer).toBeLessThanOrEqual(2);
    expect(component.winner).toBe(0); // Pas encore de gagnant au début du jeu
  });

  // Test du changement de joueur
  it('should switch player after a valid move', () => {
    component.initOrResetGame();
    const initialPlayer = component.currentPlayer;
    component.makeMove(0); // On fait un coup dans la colonne 0
    expect(component.currentPlayer).not.toBe(initialPlayer); // Le joueur devrait avoir changé
  });

  // Test que les cellules sont bien remplies
  it('should place the player’s token in the correct column', () => {
    component.initOrResetGame();
    component.makeMove(0); // On place un jeton dans la colonne 0
    expect(component.grid[5][0]).toBe(component.currentPlayer === 1 ? 2 : 1); // La dernière ligne de la colonne devrait être remplie par le joueur initial
  });

  // Test de la méthode checkWinner
  it('should detect a horizontal win', () => {
    component.initOrResetGame();

    // Simule une victoire horizontale pour le joueur 1
    component.grid[5][0] = 1;
    component.grid[5][1] = 1;
    component.grid[5][2] = 1;
    component.grid[5][3] = 1;

    const hasWon = component.checkWinner(5, 3); // On vérifie la victoire dans la colonne 3
    expect(hasWon).toBeTrue();
  });

  it('should detect a vertical win', () => {
    component.initOrResetGame();

    // Simule une victoire verticale pour le joueur 1
    component.grid[5][0] = 1;
    component.grid[4][0] = 1;
    component.grid[3][0] = 1;
    component.grid[2][0] = 1;

    const hasWon = component.checkWinner(5, 0); // On vérifie la victoire dans la ligne 5, colonne 0
    expect(hasWon).toBeTrue();
  });

  // Test de la méthode countConsecutive pour vérifier la comptabilisation des jetons alignés
  it('should count consecutive tokens', () => {
    component.initOrResetGame();

    // Simule des jetons alignés pour le joueur 1
    component.grid[5][0] = 1;
    component.grid[5][1] = 1;
    component.grid[5][2] = 1;

    const count = component.countConsecutive(5, 0, 1, 0); // Comptons horizontalement à partir de (5, 0)
    expect(count).toBe(2); // Devrait compter 2 autres jetons dans la direction (1, 0)
  });

  // Test pour s'assurer que le joueur ne peut pas jouer après une victoire
  it('should not allow moves after a win', () => {
    component.initOrResetGame();

    // Simule une victoire
    component.grid[5][0] = 1;
    component.grid[4][0] = 1;
    component.grid[3][0] = 1;
    component.grid[2][0] = 1;
    component.winner = 1;

    component.makeMove(1); // Essaye de faire un autre mouvement après la victoire
    expect(component.grid[5][1]).toBe(0); // Aucun jeton ne devrait être ajouté
  });

});
