// cypress/e2e/bookings.cy.ts
describe("Booking Flow", () => {
  // Данные тестового пользователя из seed
  const email = "user11@example.com";
  const password = "hashed_password_0";
  const fullName = "User 0";

  before(() => {
    // Очистка локального хранилища перед прогоном тестов
    cy.clearLocalStorage();
  });

  beforeEach(() => {
    // Переход на главную страницу перед каждым тестом
    cy.visit("/");
  });

  it("should login and book a flight", () => {
    // Авторизация тестового пользователя
    cy.login(email, password);
    cy.get("button").contains("Выйти").should("be.visible");

    // Поиск и бронирование рейса из seed данных
    cy.get('input[placeholder="Поиск по городам"]')
      .type("City A0")
      .should("have.value", "City A0");

    // Фильтрация рейсов по статусу (опционально)
    cy.get("select").first().select("SCHEDULED");

    // Явное ожидание загрузки результатов
    cy.wait(1000);

    // Бронирование первого найденного рейса
    cy.get("button").contains("Забронировать").first().click();

    // Проверка уведомления о успешном бронировании
    cy.on("window:alert", (text) => {
      expect(text).to.include("Рейс");
      expect(text).to.include("успешно забронирован");
    });
  });

  it("should view and cancel a booking", () => {
    // Авторизация тестового пользователя
    cy.login(email, password);

    // Переход в раздел бронирований
    cy.get("a").contains("Мои бронирования").click();
    cy.url().should("include", "/bookings");

    // Отмена первого активного бронирования
    cy.get("button").contains("Отменить").first().click();

    // Проверка обновления статуса бронирования
    cy.get("p").contains("CANCELLED").should("be.visible");
    cy.get("p").contains("Дата отмены").should("be.visible");
  });

  it("should logout", () => {
    // Авторизация и выход из системы
    cy.login(email, password);
    cy.get("button").contains("Выйти").click();

    // Проверка возврата на страницу авторизации
    cy.get("a").contains("Войти").should("be.visible");
  });
});
