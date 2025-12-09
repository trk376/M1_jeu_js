class EventBus {
  constructor() {
    this.listeners = {};
  }

  subscribe(eventName, callback) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
    
     
    return () => {
      this.listeners[eventName] = this.listeners[eventName].filter(
        (listener) => listener !== callback
      );
    };
  }

  publish(eventName, data) {
    if (!this.listeners[eventName]) {
      return;
    }
    this.listeners[eventName].forEach(callback => callback(data));
  }
}

 
export const gameEvents = new EventBus();