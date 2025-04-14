// cypress/e2e/applications.cy.ts
describe("Loan Application Flow", () => {
  // Данные тестового пользователя
  const email = "client1@example.com";
  const password = "password123";

  before(() => {
    // Очистка локального хранилища перед прогоном тестов
    cy.clearLocalStorage();
  });

  beforeEach(() => {
    // Переход на главную страницу и авторизация
    cy.visit("http://localhost:3000");
    cy.login(email, password);
    cy.wait(1000);
    // Проверка, что пользователь на странице личного кабинета
    cy.url().should("include", "/client");
    cy.get("h1").contains("Личный кабинет");
  });

  it("should create a loan application", () => {
    // Переход на вкладку "Подать заявку"
    cy.get("button").contains("Подать заявку").click();

    // Заполнение формы заявки
    cy.get('input[placeholder="Сумма кредита (руб.)"]').type("100000");
    cy.get('input[placeholder="Срок (месяцев)"]').type("12");

    // Отправка формы
    cy.get("button").contains("Отправить заявку").click();

    // Проверка уведомления об успешном создании
    cy.on("window:alert", (text) => {
      expect(text).to.include("Заявка");
      expect(text).to.include("успешно создана");
    });

    // Проверка отображения созданной заявки в таблице
    cy.get("button").contains("Мои заявки").click();
    cy.get("td").contains("100000").should("be.visible");
    cy.get("td").contains("12").should("be.visible");
    cy.get("td").contains("PENDING").should("be.visible");
  });

  it("should update user profile", () => {
    // Убедимся, что мы на вкладке профиля (она активна по умолчанию)
    cy.get("button")
      .contains("Профиль")
      .should("have.attr", "aria-selected", "true");

    // Новые данные для профиля
    const newFullName = "Иван Иванов";
    const newEmail = "client1@example.com";
    const newPhone = "+79991234567";

    // Обновление полей формы профиля
    cy.get('input[placeholder="Full Name"]').clear().type(newFullName);
    cy.get('input[placeholder="Email"]').clear().type(newEmail);
    cy.get('input[placeholder="Phone"]').clear().type(newPhone);

    // Подтверждение изменений
    cy.get("button").contains("Сохранить изменения").click();

    cy.reload();
    cy.wait(1000);
    // Проверка успешного обновления (предполагаем, что API возвращает обновленные данные)
    cy.get('input[placeholder="Full Name"]').should("have.value", newFullName);
    cy.get('input[placeholder="Email"]').should("have.value", newEmail);
    cy.get('input[placeholder="Phone"]').should("have.value", newPhone);

    // Дополнительная проверка через перезагрузку страницы
    cy.reload();
    cy.wait(1000);
    cy.get('input[placeholder="Full Name"]').should("have.value", newFullName);
    cy.get('input[placeholder="Email"]').should("have.value", newEmail);
    cy.get('input[placeholder="Phone"]').should("have.value", newPhone);
  });
});

// Кастомная команда для логина
Cypress.Commands.add("login", (email, password) => {
  cy.get('input[placeholder="Email"]').type(email);
  cy.get('input[placeholder="Пароль"]').type(password);
  cy.get("button").contains("Войти").click();
});
