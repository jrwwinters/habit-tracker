// Habit Tracker App
class HabitTracker {
    constructor() {
        this.habits = this.loadHabits();
        this.init();
    }

    init() {
        this.renderHabits();
        this.updateStats();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const addBtn = document.getElementById('addHabitBtn');
        const habitInput = document.getElementById('habitInput');

        addBtn.addEventListener('click', () => this.addHabit());
        habitInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addHabit();
            }
        });
    }

    addHabit() {
        const input = document.getElementById('habitInput');
        const habitName = input.value.trim();

        if (!habitName) {
            return;
        }

        const habit = {
            id: Date.now().toString(),
            name: habitName,
            completedDates: [],
            streak: 0,
            bestStreak: 0,
            createdAt: new Date().toISOString()
        };

        this.habits.push(habit);
        this.saveHabits();
        this.renderHabits();
        this.updateStats();
        input.value = '';
        input.focus();
    }

    toggleHabit(habitId) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return;

        const today = this.getTodayKey();
        const index = habit.completedDates.indexOf(today);

        if (index > -1) {
            // Uncomplete
            habit.completedDates.splice(index, 1);
        } else {
            // Complete
            habit.completedDates.push(today);
        }

        // Update streak
        this.updateStreak(habit);
        
        this.saveHabits();
        this.renderHabits();
        this.updateStats();
    }

    updateStreak(habit) {
        if (habit.completedDates.length === 0) {
            habit.streak = 0;
            return;
        }

        // Convert dates to Date objects and sort (newest first)
        const sortedDates = habit.completedDates
            .map(date => {
                const d = new Date(date);
                d.setHours(0, 0, 0, 0);
                return d;
            })
            .sort((a, b) => b - a);

        // Calculate current streak (consecutive days from today/yesterday backwards)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const mostRecentDate = sortedDates[0];
        const daysSinceMostRecent = Math.floor((today - mostRecentDate) / (1000 * 60 * 60 * 24));

        let currentStreak = 0;
        
        // Only count streak if most recent completion is today or yesterday
        if (daysSinceMostRecent <= 1) {
            currentStreak = 1;
            let expectedDate = new Date(mostRecentDate);
            expectedDate.setDate(expectedDate.getDate() - 1);
            expectedDate.setHours(0, 0, 0, 0);
            
            for (let i = 1; i < sortedDates.length; i++) {
                const nextDate = sortedDates[i];
                if (nextDate.getTime() === expectedDate.getTime()) {
                    currentStreak++;
                    expectedDate.setDate(expectedDate.getDate() - 1);
                } else {
                    break;
                }
            }
        }

        // Calculate best streak (longest consecutive streak ever)
        let bestStreak = 1;
        let tempStreak = 1;
        
        for (let i = 1; i < sortedDates.length; i++) {
            const date1 = sortedDates[i - 1];
            const date2 = sortedDates[i];
            const daysDiff = Math.floor((date1 - date2) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === 1) {
                tempStreak++;
                bestStreak = Math.max(bestStreak, tempStreak);
            } else {
                tempStreak = 1;
            }
        }

        habit.streak = currentStreak;
        habit.bestStreak = Math.max(habit.bestStreak || 0, bestStreak);
    }

    deleteHabit(habitId) {
        if (confirm('Are you sure you want to delete this habit?')) {
            this.habits = this.habits.filter(h => h.id !== habitId);
            this.saveHabits();
            this.renderHabits();
            this.updateStats();
        }
    }

    getTodayKey() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    isCompletedToday(habit) {
        return habit.completedDates.includes(this.getTodayKey());
    }

    renderHabits() {
        const habitsList = document.getElementById('habitsList');
        const emptyState = document.getElementById('emptyState');

        if (this.habits.length === 0) {
            habitsList.innerHTML = '';
            emptyState.classList.add('show');
            return;
        }

        emptyState.classList.remove('show');
        habitsList.innerHTML = this.habits.map(habit => {
            const isCompleted = this.isCompletedToday(habit);
            const completedCount = habit.completedDates.length;
            const daysSinceCreated = Math.floor(
                (new Date() - new Date(habit.createdAt)) / (1000 * 60 * 60 * 24)
            ) + 1;
            const completionRate = daysSinceCreated > 0 
                ? Math.round((completedCount / daysSinceCreated) * 100) 
                : 0;

            return `
                <div class="habit-item ${isCompleted ? 'completed' : ''}">
                    <div 
                        class="habit-checkbox ${isCompleted ? 'checked' : ''}"
                        onclick="habitTracker.toggleHabit('${habit.id}')"
                    ></div>
                    <div class="habit-content">
                        <div class="habit-name">${this.escapeHtml(habit.name)}</div>
                        <div class="habit-stats">
                            <div class="habit-stat">
                                <span>🔥</span>
                                <span>${habit.streak} day${habit.streak !== 1 ? 's' : ''}</span>
                            </div>
                            <div class="habit-stat">
                                <span>⭐</span>
                                <span>${habit.bestStreak} best</span>
                            </div>
                            <div class="habit-stat">
                                <span>📊</span>
                                <span>${completionRate}%</span>
                            </div>
                        </div>
                    </div>
                    <div class="habit-actions">
                        <button 
                            class="btn-icon btn-delete" 
                            onclick="habitTracker.deleteHabit('${habit.id}')"
                            title="Delete habit"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateStats() {
        const totalHabits = document.getElementById('totalHabits');
        const todayCompleted = document.getElementById('todayCompleted');
        const currentStreak = document.getElementById('currentStreak');

        const todayKey = this.getTodayKey();
        const completedToday = this.habits.filter(h => 
            h.completedDates.includes(todayKey)
        ).length;

        const bestStreak = this.habits.length > 0
            ? Math.max(...this.habits.map(h => h.bestStreak))
            : 0;

        totalHabits.textContent = this.habits.length;
        todayCompleted.textContent = completedToday;
        currentStreak.textContent = bestStreak;
    }

    saveHabits() {
        localStorage.setItem('habits', JSON.stringify(this.habits));
    }

    loadHabits() {
        const stored = localStorage.getItem('habits');
        if (stored) {
            return JSON.parse(stored);
        }
        return [];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app
const habitTracker = new HabitTracker();
