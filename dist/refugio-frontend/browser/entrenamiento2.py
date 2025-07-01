import pickle
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow.keras import layers, models

# Cargar datos
with open('embeddings_final4.pkl', 'rb') as f:
    data = pickle.load(f)

X = np.array(data['X'])  
y = np.array(data['y'])

# Codificar etiquetas
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# Guardar codificador
with open('label_encoder.pkl', 'wb') as f:
    pickle.dump(le, f)

# Dividir datos
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded,
    test_size=0.2,
    random_state=42,
    stratify=y_encoded
)

# Crear modelo
model = models.Sequential([
    layers.Input(shape=(X.shape[1],)),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(64, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(len(np.unique(y_encoded)), activation='softmax')
])

# Compilar
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Entrenar
history = model.fit(
    X_train, y_train,
    epochs=1,
    batch_size=32,
    validation_data=(X_test, y_test)
)

# Guardar modelo
model.save('modeloreconocimiento2.h5')

# Evaluar
loss, acc = model.evaluate(X_test, y_test)
print(f' Precisión del modelo en prueba: {acc * 100:.2f}%')
