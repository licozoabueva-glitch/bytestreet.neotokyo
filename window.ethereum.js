import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

declare let window: any; // Declare window to access window.ethereum

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('myapp');
  protected accounts = signal<string[]>([]);

  async connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.accounts.set(accounts);
        console.log('Connected accounts:', accounts);

        // Listen for account changes
        window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
          this.accounts.set(newAccounts);
          console.log('Accounts changed:', newAccounts);
        });

        // Listen for network changes
        window.ethereum.on('chainChanged', (chainId: string) => {
          console.log('Network changed:', chainId);
          // You might want to reload the page or update data based on the new network
        });

      } catch (error: any) {
        if (error.code === 4001) {
          // User rejected the connection
          console.log('Please connect to MetaMask.');
        } else {
          console.error('Error connecting to MetaMask:', error);
        }
      }
    } else {
      console.log('MetaMask is not installed!');
      // Guide the user to install MetaMask
    }
  }
}
