import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports:[CommonModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  grid: number[][] = []; // La matrice de jeu
  currentPlayer: number = 1; // Le joueur courant (1 => Joueur 1 Rouge, 2 => Joueur 2 Jaune)
  winner: number = 0; // Le joueur gagnant initialisé à 0 puis 1 ou 2 si gagnant

  // Initialiser la partie
  constructor() {
    this.initOrResetGame();
  }

  // Méthode permettant d'initialiser ou réinitialiser la partie
  initOrResetGame(): void {
    this.grid = Array.from({ length: 6 }, () => Array(7).fill(0)); // Création d'une nouvelle matrice de 6 lignes (rows) avec chacune 7 colonnes (columns)
    this.currentPlayer =  Math.random() < 0.5 ? 1 : 2; // Un joueur aléatoire commence
    this.winner = 0; // On réinitialise le gagnant
  }

  // Methode permettant de remplir une case de la matrice de jeu
  makeMove(column: number): void {
    // Si on a déjà un gagnant, on ne fait rien au clic
    if (this.winner !== 0) {
      return;
    }

    // Boucle sur les lignes de la matrice en commencant par la dernière ligne
    for (let row = this.grid.length - 1; row >= 0; row--) {
      // Si il n'y a pas de pion encore dans cette case
      if (this.grid[row][column] === 0) {
        this.grid[row][column] = this.currentPlayer; // Alors on rempli la case avec la valeur du joueur courant

        // On check si le joueur courant à gagné
        if (this.checkWinner(row, column)) {
          this.winner = this.currentPlayer; // Si oui, on rempli la valeur du gagnant avec la valeur du joueur courant
        } else {
          this.currentPlayer = this.currentPlayer === 1 ? 2 : 1; // Sinon on change le joueur courant et la partie continue
        }

        break; // Si une de ces actions s'est produite, alors on arrête la boucle
      }
    }
  }


  checkWinner(row: number, col: number): boolean {
    const directions = [
      { x: 1, y: 0 },  // Horizontal
      { x: 0, y: 1 },  // Vertical
      { x: 1, y: 1 },  // Diagonale droite-bas
      { x: 1, y: -1 }  // Diagonale gauche-bas
    ];


    // On parcours toutes les directions possibles définies plus haut
    for (let { x, y } of directions) {
      let count = 1;

      // On compte dans les deux sens
      count += this.countConsecutive(row, col, x, y);
      count += this.countConsecutive(row, col, -x, -y);

      // Si le résultat est supérieur à 4, on définit une victoire et on arrête la boucle
      if (count >= 4) {
        return true;
      }
    }

    return false; // Sinon il n'y a pas de gagnant pour l'instant
  }

  // Méthode permettant de compter les cases consécutives dans la direction choisie
  countConsecutive(row: number, col: number, dx: number, dy: number): number {
    let count = 0;

    let player = this.grid[row][col]; // On récupère la position initiale pour compter

    // On boucle pour compter
    for (let i = 1; i < 4; i++) {
      const newRow = row + dy * i;
      const newCol = col + dx * i;

      // Si on sort de la matrice ou que le jeton n'est pas celui du joueur, on arrête la boucle
      if (
        newRow < 0 || newRow >= this.grid.length ||
        newCol < 0 || newCol >= this.grid[0].length ||
        this.grid[newRow][newCol] !== player
      ) {
        break;
      }

      count++; // Sinon on incrémente le comptage
    }

    return count; // On retourne le comptage
  }
}
