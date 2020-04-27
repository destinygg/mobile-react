# destiny.gg Mobile App

`app/chat` contains re-implementations of web client JavaScript for mobile app.

`app/screens/AuthView.tsx` launches a web-view for user login on first-launch, and the cookie then persists and is used by React Native's standard fetch implementation.  
