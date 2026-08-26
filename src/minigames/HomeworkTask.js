/**
 * Sister Sneak: Phone Locked - Mini-Game: Math Homework Sheet (Bedroom/Study)
 * Solve 3 simple quick math cards on the study desk!
 */

import { MiniGameBase } from './MiniGameBase.js';

export class HomeworkTask extends MiniGameBase {
  constructor() {
    super({
      id: "HOMEWORK_MATH",
      title: "Solve Math Homework Worksheet",
      icon: "✏️",
      instructions: "Pick the correct answer on the study desk worksheet cards!"
    });
    this.currentStep = 0;
    this.questions = [
      { q: "7 + 8 = ?", options: [14, 15, 16], ans: 15 },
      { q: "12 × 3 = ?", options: [36, 32, 28], ans: 36 },
      { q: "45 - 19 = ?", options: [24, 26, 28], ans: 26 }
    ];
  }

  render() {
    this.renderQuestion();
  }

  renderQuestion() {
    const q = this.questions[this.currentStep];
    this.container.innerHTML = `
      <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; background:#F8FAFC;">
        <div style="background:#FFF; border:3px solid #64748B; border-radius:12px; padding:16px 24px; text-align:center; box-shadow:0 8px 16px rgba(0,0,0,0.1); width:280px;">
          <div style="font-size:10px; font-weight:800; color:#3B82F6; letter-spacing:1px;">STUDY CARD #${this.currentStep + 1} / 3</div>
          <div style="font-size:24px; font-weight:800; color:#1E293B; margin:8px 0;">${q.q}</div>
          <div style="display:flex; justify-content:center; gap:8px; margin-top:10px;">
            ${q.options.map((opt) => `
              <button class="math-opt-btn" data-val="${opt}" style="background:#F1F5F9; border:2px solid #CBD5E1; border-radius:8px; padding:8px 14px; font-size:14px; font-weight:800; color:#1E293B; cursor:pointer; transition:all 0.2s;">
                ${opt}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const btns = this.container.querySelectorAll(".math-opt-btn");
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const val = parseInt(btn.getAttribute("data-val"), 10);
        if (val === q.ans) {
          btn.style.background = "#DCFCE7";
          btn.style.borderColor = "#16A34A";
          this.currentStep++;
          this.updateProgress(this.currentStep / this.questions.length);
          if (this.currentStep < this.questions.length) {
            setTimeout(() => this.renderQuestion(), 300);
          }
        } else {
          btn.style.background = "#FEE2E2";
          btn.style.borderColor = "#EF4444";
        }
      });
    });
  }
}
