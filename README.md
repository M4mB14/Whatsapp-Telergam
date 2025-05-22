# Whatsapp-Telergam Integration
Репозиторий для интеграции Telegram-Whatsapp 

Для корректной работы нужна весрия nodejs 14 или выше
Для корректной работы скрипта нужно иметь внешний адрес webhook-а а так же возможность этого webhook-а реагировать на новые запросы 

1) Скопируйте репозиторий коммандой git clone
2) Установить зависимости Green API следующей командой npm install @green-api/greenapi-integration
3) установить оставшиеся зависимости коммндой npm install
4) создать файл .env и заполнить его согласно шаблону 
      ```
      # Green API (WhatsApp)
      GREENAPI_INSTANCE_ID=
      GREENAPI_API_TOKEN=
      GREENAPI_PHONE_NUMBER=
      
      # Telegram Bot (для работы с группой)
      TELEGRAM_BOT_TOKEN=
      TELEGRAM_GROUP_CHAT_ID=
      
      # Webhook & Server
      APP_URL=
      PORT=
      ```
5) Запустить скрипт командой npm run dev

Cтруктура проекта:

      ├── src/
      │   ├── core/
      │   │   ├── adapter.ts
      │   │   ├── router.ts
      │   │   ├── storage.ts
      │   │   └── transformer.ts
      │   ├── main.ts
      │   └── types/
      │       └── types.ts
      ├──.env
      ├── tsconfig.json
      ├── package.json

Adapter.ts - Основа вашей интеграции. Управляет сообщениями и инстансами, а также логикой взаимодействия с платформой.
Router.ts - Файл определяет маршруты Express для обработки вебхуков от Telegram и WhatsApp
Storage.ts - Интерфейс для операций с хранением данных.
Transformer.ts - Преобразовывает форматы сообщений между GREEN-API и вашей 
Main.ts - Основная точка входа программы 
Types.ts - Этот файл описывает интерфейсы TypeScript для структуры входящего вебхука от Telegram и исходящего сообщения, отправляемого в Telegram.
