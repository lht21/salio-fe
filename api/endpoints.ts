/**
 * API Endpoints Configuration
 * Định nghĩa toàn bộ các đường dẫn API theo cấu trúc của Backend.
 */

export const API_ENDPOINTS = {
  AUTH: {
    SEND_REGISTER_OTP: '/api/v1/auth/register/send-otp',
    VERIFY_REGISTER_OTP: '/api/v1/auth/register/verify-otp',
    CREATE_ACCOUNT: '/api/v1/auth/register/create-account',
    SOCIAL_LOGIN: '/api/v1/auth/social-login',
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
    SEND_FORGOT_PASSWORD_OTP: '/api/v1/auth/forgot-password/send-otp',
    VERIFY_FORGOT_PASSWORD_OTP: '/api/v1/auth/forgot-password/verify-otp',
    RESET_PASSWORD: '/api/v1/auth/forgot-password/reset',
    REFRESH_TOKEN: '/api/v1/auth/refresh-token',
  },

  VOCABULARY: {
    // Core
    GET_ALL: '/api/v1/vocabularies',
    GET_BY_ID: (id: string) => `/api/v1/vocabularies/${id}`,
    STUDY_QUEUE: '/api/v1/vocabularies/study-queue',
    LEARNING_PROGRESS: '/api/v1/vocabularies/learning-progress',
    MARK_STATUS: (id: string) => `/api/v1/vocabularies/${id}/mark`,
    
    // Admin
    IMPORT: '/api/v1/vocabularies/import',
    BULK_IMAGES: '/api/v1/vocabularies/bulk-images',
    PUBLISH: (id: string) => `/api/v1/vocabularies/${id}/publish`,

    // Quizzes (Admin & Management)
    QUIZZES: '/api/v1/vocabularies/quizzes',
    QUIZ_BY_ID: (quizId: string) => `/api/v1/vocabularies/quizzes/${quizId}`,
    QUIZ_ITEMS: (quizId: string) => `/api/v1/vocabularies/quizzes/${quizId}/items`,
    QUIZ_ITEMS_REORDER: (quizId: string) => `/api/v1/vocabularies/quizzes/${quizId}/items/reorder`,
    QUIZ_PUBLISH: (quizId: string) => `/api/v1/vocabularies/quizzes/${quizId}/publish`,

    // Quiz Sessions (Student)
    QUIZ_START: '/api/v1/vocabularies/quiz/start',
    QUIZ_RESULTS: '/api/v1/vocabularies/quiz/results',
    QUIZ_SESSION: (sessionId: string) => `/api/v1/vocabularies/quiz/session/${sessionId}`,
    QUIZ_SAVE_ANSWER: (sessionId: string) => `/api/v1/vocabularies/quiz/session/${sessionId}/save-answer`,
    QUIZ_SUBMIT: (sessionId: string) => `/api/v1/vocabularies/quiz/session/${sessionId}/submit`,
    QUIZ_SESSION_RESULT: (sessionId: string) => `/api/v1/vocabularies/quiz/session/${sessionId}/result`,
  },

  GAMIFICATION: {
    LEADERBOARD: '/api/v1/gamification/leaderboard',
    CHECK_IN: '/api/v1/gamification/check-in',
    MISSIONS: '/api/v1/gamification/missions',
    CLAIM_MISSION: '/api/v1/gamification/missions/claim',
    STORE: '/api/v1/gamification/store',
    PURCHASE: '/api/v1/gamification/store/purchase',
  },

  ATTEMPT: {
    GET_STATUS: (attemptId: string) => `/api/v1/attempts/${attemptId}`,
    SAVE_ANSWER: (attemptId: string) => `/api/v1/attempts/${attemptId}/save-answer`,
    SUBMIT: (attemptId: string) => `/api/v1/attempts/${attemptId}/submit`,
    GET_RESULT: (attemptId: string) => `/api/v1/attempts/${attemptId}/result`,
    REVIEW: (attemptId: string) => `/api/v1/attempts/${attemptId}/review`,
  },

  AUDIT_LOG: {
    GET_ALL: '/api/audit-logs',
  },

  FLASHCARD: {
    GET_ALL: '/api/v1/flashcard-sets',
    CREATE: '/api/v1/flashcard-sets',
    GET_BY_ID: (id: string) => `/api/v1/flashcard-sets/${id}`,
    UPDATE: (id: string) => `/api/v1/flashcard-sets/${id}`,
    DELETE: (id: string) => `/api/v1/flashcard-sets/${id}`,
    ADD_CARDS: (id: string) => `/api/v1/flashcard-sets/${id}/cards`,
    REMOVE_CARD: (id: string, vocabId: string) => `/api/v1/flashcard-sets/${id}/cards/${vocabId}`,
  },

  PAYMENT: {
    WEBHOOK: '/api/v1/payments/webhook',
    VERIFY_IAP: '/api/v1/payments/verify-iap',
    GET_ALL: '/api/v1/payments',
    GET_BY_ID: (paymentId: string) => `/api/v1/payments/${paymentId}`,
    UPDATE_STATUS: (paymentId: string) => `/api/v1/payments/${paymentId}/status`,
    GRANT_SUBSCRIPTION: '/api/v1/payments/grant',
  },

  PLACEMENT_TEST: {
    START: '/api/v1/placement-test/start',
    GET_SESSION: (sessionId: string) => `/api/v1/placement-test/session/${sessionId}`,
    SAVE_ANSWER: (sessionId: string) => `/api/v1/placement-test/session/${sessionId}/save-answer`,
    SUBMIT: (sessionId: string) => `/api/v1/placement-test/session/${sessionId}/submit`,
    GET_RESULT: (sessionId: string) => `/api/v1/placement-test/session/${sessionId}/result`,
    GET_SKIPPED_LESSONS: (sessionId: string) => `/api/v1/placement-test/session/${sessionId}/skipped-lessons`,
    // Admin
    GET_CONFIG: '/api/v1/admin/placement-test',
    ASSEMBLE: '/api/v1/admin/placement-test/assemble',
    REORDER_QUESTIONS: '/api/v1/admin/placement-test/questions/reorder',
    REMOVE_QUESTIONS: '/api/v1/admin/placement-test/questions/remove',
    GET_ALL_SESSIONS: '/api/v1/placement-test/sessions',
    GET_SESSION_BY_ID: (sessionId: string) => `/api/v1/placement-test/sessions/${sessionId}`,
  },

  PRACTICE: {
    HISTORY: '/api/v1/practice/history',
    GET_SETS_BY_TYPE: (type: string) => `/api/v1/practice/${type}/sets`,
    GET_SET_BY_ID: (type: string, setId: string) => `/api/v1/practice/${type}/sets/${setId}`,
    START_ATTEMPT: (type: string, setId: string) => `/api/v1/practice/${type}/sets/${setId}/start`,
  },

  QUESTION_BANK: {
    GET_ALL_BY_TYPE: (type: string) => `/api/v1/bank/${type}`, // type: reading, listening, writing, speaking, grammar, vocabulary
    CREATE: (type: string) => `/api/v1/bank/${type}`,
    GET_BY_ID: (type: string, itemId: string) => `/api/v1/bank/${type}/${itemId}`,
    UPDATE: (type: string, itemId: string) => `/api/v1/bank/${type}/${itemId}`,
    DELETE: (type: string, itemId: string) => `/api/v1/bank/${type}/${itemId}`,
  },

  SUBSCRIPTION: {
    CURRENT: '/api/v1/subscriptions/current',
    HISTORY: '/api/v1/subscriptions/history',
    PLANS: '/api/v1/subscriptions/plans',
    PLAN_BY_ID: (planId: string) => `/api/v1/subscriptions/plans/${planId}`,
    CHECKOUT: (planId: string) => `/api/v1/subscriptions/plans/${planId}/checkout`,
    CANCEL: '/api/v1/subscriptions/cancel',
    // Admin
    CREATE_PLAN: '/api/v1/subscriptions/plans',
    UPDATE_PLAN: (planId: string) => `/api/v1/subscriptions/plans/${planId}`,
    DELETE_PLAN: (planId: string) => `/api/v1/subscriptions/plans/${planId}`,
  },

  SUPPORT: {
    TOPICS: '/api/v1/support/topics',
    CREATE_TOPIC: '/api/v1/support/topics',
    TOPIC_BY_ID: (topicId: string) => `/api/v1/support/topics/${topicId}`,
    UPDATE_TOPIC: (topicId: string) => `/api/v1/support/topics/${topicId}`,
    DELETE_TOPIC: (topicId: string) => `/api/v1/support/topics/${topicId}`,
    TICKETS: '/api/v1/support/tickets',
    CREATE_TICKET: '/api/v1/support/tickets',
    TICKET_BY_ID: (ticketId: string) => `/api/v1/support/tickets/${ticketId}`,
    TICKET_MESSAGES: (ticketId: string) => `/api/v1/support/tickets/${ticketId}/messages`,
    TICKET_STATUS: (ticketId: string) => `/api/v1/support/tickets/${ticketId}/status`,
    TICKET_ASSIGN: (ticketId: string) => `/api/v1/support/tickets/${ticketId}/assign`,
  },

  UPLOAD: {
    AUDIO: '/api/v1/upload/audio',
    IMAGE: '/api/v1/upload/image',
  },

  USER: {
    GET_ME: '/api/v1/users/me',
    UPDATE_PROFILE: '/api/v1/users/me',
    UPDATE_AVATAR: '/api/v1/users/me/avatar',
    CHANGE_PASSWORD: '/api/v1/users/me/password',
    UPDATE_PREFERENCES: '/api/v1/users/me/preferences',
    GET_MY_STATS: '/api/v1/users/me/stats',
    // Admin
    GET_ALL_USERS: '/api/v1/users',
    GET_USER_DETAILS: (userId: string) => `/api/v1/users/${userId}`,
    UPDATE_USER: (userId: string) => `/api/v1/users/${userId}`,
    UPDATE_USER_STATUS: (userId: string) => `/api/v1/users/${userId}/status`,
    DELETE_USER: (userId: string) => `/api/v1/users/${userId}`,
    GET_USER_PROGRESS: (userId: string) => `/api/v1/users/${userId}/progress`,
    GET_USER_SUBSCRIPTION: (userId: string) => `/api/v1/users/${userId}/subscription`,
  }

};