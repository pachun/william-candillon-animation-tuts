import { StyleSheet, Text, View } from "react-native"
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler"
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated"

type MyAnimatedContext = {
  currentX: number
  currentY: number
}

export default function App() {
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    MyAnimatedContext
  >({
    onStart: (event, context) => {
      context.currentX = translateX.value
      context.currentY = translateY.value
    },
    onActive: (event, context) => {
      translateX.value = context.currentX + event.translationX
      translateY.value = context.currentY + event.translationY
    },
  })
  const style = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    }
  })

  return (
    <View style={styles.container}>
      <PanGestureHandler {...{ onGestureEvent }}>
        <Animated.View {...{ style }}>
          <View style={styles.square} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  square: {
    width: 300,
    height: 150,
    backgroundColor: "#bbb",
  },
})
