// Trading Journal App
class TradingJournal {
    constructor() {
        this.trades = this.loadTrades();
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        // Set today's date as default
        document.getElementById('date').valueAsDate = new Date();

        // Event Listeners
        document.getElementById('tradeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTrade();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.displayTrades();
            });
        });

        // Initial display
        this.updateStats();
        this.displayTrades();
    }

    async addTrade() {
        const date = document.getElementById('date').value;
        const symbol = document.getElementById('symbol').value;
        const direction = document.getElementById('direction').value;
        const size = document.getElementById('size').value;
        const entry = document.getElementById('entry').value;
        const exit = document.getElementById('exit').value;
        const pnl = parseFloat(document.getElementById('pnl').value);
        const notes = document.getElementById('notes').value;
        const chartFile = document.getElementById('chart').files[0];

        let chartData = null;
        if (chartFile) {
            chartData = await this.readFileAsBase64(chartFile);
        }

        const trade = {
            id: Date.now(),
            date,
            symbol,
            direction,
            size: size || null,
            entry: entry || null,
            exit: exit || null,
            pnl,
            notes,
            chart: chartData
        };

        this.trades.unshift(trade);
        this.saveTrades();
        this.updateStats();
        this.displayTrades();
        document.getElementById('tradeForm').reset();
        document.getElementById('date').valueAsDate = new Date();
    }

    readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    displayTrades() {
        const tradesList = document.getElementById('tradesList');
        let filteredTrades = this.trades;

        // Apply filter
        if (this.currentFilter === 'Long') {
            filteredTrades = this.trades.filter(t => t.direction === 'Long');
        } else if (this.currentFilter === 'Short') {
            filteredTrades = this.trades.filter(t => t.direction === 'Short');
        } else if (this.currentFilter === 'winning') {
            filteredTrades = this.trades.filter(t => t.pnl > 0);
        } else if (this.currentFilter === 'losing') {
            filteredTrades = this.trades.filter(t => t.pnl < 0);
        }

        if (filteredTrades.length === 0) {
            tradesList.innerHTML = `
                <div class="empty-state">
                    <p>📋 Keine Trades gefunden</p>
                    <p style="font-size: 0.9rem;">Füge deinen ersten Trade hinzu!</p>
                </div>
            `;
            return;
        }

        tradesList.innerHTML = filteredTrades.map(trade => this.createTradeCard(trade)).join('');

        // Add delete event listeners
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.deleteTrade(id);
            });
        });

        // Add image click listeners for modal
        document.querySelectorAll('.trade-chart img').forEach(img => {
            img.addEventListener('click', (e) => {
                this.openImageModal(e.target.src);
            });
        });
    }

    createTradeCard(trade) {
        const pnlClass = trade.pnl >= 0 ? 'positive' : 'negative';
        const pnlSign = trade.pnl >= 0 ? '+' : '';

        return `
            <div class="trade-card">
                <div class="trade-header">
                    <div>
                        <div class="trade-symbol">${trade.symbol}</div>
                        <div class="trade-date">${this.formatDate(trade.date)}</div>
                    </div>
                    <div class="trade-direction ${trade.direction}">${trade.direction}</div>
                </div>

                ${trade.chart ? `
                    <div class="trade-chart">
                        <img src="${trade.chart}" alt="Trade Chart">
                    </div>
                ` : ''}

                <div class="trade-pnl ${pnlClass}">
                    ${pnlSign}${trade.pnl.toFixed(2)} €
                </div>

                <div class="trade-details">
                    ${trade.size ? `
                        <div class="trade-detail">
                            <div class="trade-detail-label">Größe</div>
                            <div class="trade-detail-value">${trade.size}</div>
                        </div>
                    ` : ''}
                    ${trade.entry ? `
                        <div class="trade-detail">
                            <div class="trade-detail-label">Entry</div>
                            <div class="trade-detail-value">${parseFloat(trade.entry).toFixed(5)}</div>
                        </div>
                    ` : ''}
                    ${trade.exit ? `
                        <div class="trade-detail">
                            <div class="trade-detail-label">Exit</div>
                            <div class="trade-detail-value">${parseFloat(trade.exit).toFixed(5)}</div>
                        </div>
                    ` : ''}
                </div>

                ${trade.notes ? `
                    <div class="trade-notes">
                        <strong>Notizen:</strong><br>
                        ${trade.notes.replace(/\n/g, '<br>')}
                    </div>
                ` : ''}

                <div class="trade-actions">
                    <button class="btn-delete" data-id="${trade.id}">Löschen</button>
                </div>
            </div>
        `;
    }

    openImageModal(src) {
        // Create modal if it doesn't exist
        let modal = document.querySelector('.modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <span class="modal-close">&times;</span>
                <img src="" alt="Full Chart">
            `;
            document.body.appendChild(modal);

            modal.querySelector('.modal-close').addEventListener('click', () => {
                modal.classList.remove('active');
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }

        modal.querySelector('img').src = src;
        modal.classList.add('active');
    }

    deleteTrade(id) {
        if (confirm('Möchtest du diesen Trade wirklich löschen?')) {
            this.trades = this.trades.filter(t => t.id !== id);
            this.saveTrades();
            this.updateStats();
            this.displayTrades();
        }
    }

    updateStats() {
        const totalTrades = this.trades.length;
        const winningTrades = this.trades.filter(t => t.pnl > 0).length;
        const losingTrades = this.trades.filter(t => t.pnl < 0).length;
        const totalPnL = this.trades.reduce((sum, t) => sum + t.pnl, 0);

        document.getElementById('totalTrades').textContent = totalTrades;
        document.getElementById('winningTrades').textContent = winningTrades;
        document.getElementById('losingTrades').textContent = losingTrades;

        const pnlElement = document.getElementById('totalPnL');
        const sign = totalPnL >= 0 ? '+' : '';
        pnlElement.textContent = `${sign}${totalPnL.toFixed(2)} €`;
        pnlElement.style.color = totalPnL >= 0 ? '#155724' : '#721c24';
    }

    formatDate(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    loadTrades() {
        const saved = localStorage.getItem('tradingJournalTrades');
        return saved ? JSON.parse(saved) : [];
    }

    saveTrades() {
        localStorage.setItem('tradingJournalTrades', JSON.stringify(this.trades));
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new TradingJournal();
});
