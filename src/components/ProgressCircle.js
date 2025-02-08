import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import PropTypes from 'prop-types';
import { MaterialIcons } from '@expo/vector-icons'; // Usamos íconos de MaterialIcons

const ProgressCircle = memo(({ percentage, label, color, iconName, value, total }) => {
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const cappedPercentage = Math.min(percentage, 100);
  const progress = (cappedPercentage / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg height="120" width="120">
        {/* Círculo de fondo */}
        <Circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#444"
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.2}
        />
        {/* Círculo de progreso */}
        <Circle
          cx="60"
          cy="60"
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
        />
      </Svg>

      {/* Contenido en el centro */}
      <View style={styles.textContainer}>
        {/* Ícono */}
        <MaterialIcons name={iconName} size={24} color={color} />
        {/* Valor actual */}
        <Text style={styles.value}>{value}</Text>
        {/* Texto descriptivo */}
        <Text style={styles.label}>{label}</Text>
        {/* Meta total */}
        <Text style={styles.total}>{`/ ${total}`}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  label: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 5,
  },
  total: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
});

ProgressCircle.propTypes = {
  percentage: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default ProgressCircle;