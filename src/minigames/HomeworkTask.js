/**
 * Sister Sneak: Phone Locked - Mini-Game: Fun Study & Math Riddle Worksheet
 * Interactive notebook with 3 fun mini-riddles and colorful sticker rewards!
 */

import { MiniGameBase } from './MiniGameBase.js';

export class HomeworkTask extends MiniGameBase {
  constructor() {
    super({
      id: "HOMEWORK_MATH",
      title: "📝 Study & Riddle Worksheet",
      icon: "📚",
      instructions: "Solve all 3 fun study questions to get Mummy's Gold Star sticker!"
    });
    this.currentStep = 0;
    this.questions = [
      {
        q: "🍎 4 Apples + 5 Apples = ?",
        options: ["7", "9", "12"],
        correct: 1
      },
      {
        q: "🥭 3 Mango Baskets with 3 Mangoes each (3 × 3) = ?",
        options: ["6", "9", "15"],
        correct: 1
      },
      {
        q: "📚 Which one is used for studying?",
        options: ["✏️ Pencil & Book", "🥿 Chappal", "🧹 Mop"],
        correct: 0
      }
    ];
  }

  render() {
    this.renderQuestion();
  }

  renderQuestion() {
    if (this.currentStep >= this.questions.length) {
      this.container.innerHTML = `
        <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; background:#FEF9C3; padding:16px; border-radius:12px;">
          <div style="font-size:48px;">🌟</div>
          <div style="font-size:18px; font-weight:800; color:#854D0E;">100 / 100 EXCELLENT!</div>
          <div style="font-size:12px; font-weight:700; color:#A16207;">Mummy's Gold Star Sticker stamped on notebook! ⭐</div>
        </div>
      `;
      this.updateProgress(1.0);
      return;
    }

    const currentQ = this.questions[this.currentStep];

    this.container.innerHTML = `
      <div style="width:100%; height:100%; display:flex; flex-direction:column; justify-content:space-between; background:#FFFBEB; border:3px solid #D97706; border-radius:14px; padding:14px; box-shadow:inset 0 0 10px rgba(0,0,0,0.05);">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px dashed #FBBF24; padding-bottom:6px;">
          <span style="font-size:12px; font-weight:800; color:#92400E;">📝 Question ${this.currentStep + 1} of ${this.questions.length}</span>
          <span style="font-size:11px; font-weight:700; color:#059669;">Jisha's Study Sheet</span>
        </div>

        <div style="font-size:16px; font-weight:800; color:#1E293B; text-align:center; margin:12px 0;">
          ${currentQ.q}
        </div>

        <div id="study-options" style="display:flex; flex-direction:column; gap:8px;">
          ${currentQ.options.map((opt, idx) => `
            <button class="study-opt-btn" data-idx="${idx}" style="background:#FFF; border:2px solid #F59E0B; border-radius:10px; padding:10px; font-size:14px; font-weight:800; color:#78350F; cursor:pointer; transition:all 0.15s; text-align:center;">
              ${opt}
            </button>
          `).join('')}
        </div>

        <div id="study-feedback" style="font-size:11px; font-weight:700; text-align:center; color:#64748B; min-height:16px;">
          Choose the correct answer!
        </div>
      </div>
    `;

    const btns = this.container.querySelectorAll(".study-opt-btn");
    const feedback = this.container.querySelector("#study-feedback");

    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const chosen = parseInt(btn.getAttribute("data-idx"));
        if (chosen === currentQ.correct) {
          btn.style.background = "#DCFCE7";
          btn.style.borderColor = "#16A34A";
          btn.style.color = "#15803D";
          if (feedback) {
            feedback.innerText = "✨ Correct! Super Smart!";
            feedback.style.color = "#16A34A";
          }
          setTimeout(() => {
            this.currentStep++;
            this.updateProgress(this.currentStep / this.questions.length);
            this.renderQuestion();
          }, 600);
        } else {
          btn.style.background = "#FEE2E2";
          btn.style.borderColor = "#DC2626";
          btn.style.color = "#991B1B";
          if (feedback) {
            feedback.innerText = "Oops! Try another answer!";
            feedback.style.color = "#DC2626";
          }
        }
      });
    });
  }
}
