import { Dimensions, StyleSheet, Text, View } from "react-native"
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler"
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withDecay,
} from "react-native-reanimated"
import { withBouncing } from "./withBouncing"

const clamp = (value: number, lowerBound: number, upperBound: number) => {
  "worklet"
  return Math.min(Math.max(lowerBound, value), upperBound)
}

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height
const objectWidth = 300
const objectHeight = 150

type MyAnimatedContext = {
  currentX: number
  currentY: number
}

export default function App() {
  const xBoundary = windowWidth - objectWidth
  const yBoundary = windowHeight - objectHeight
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
      translateX.value = clamp(
        context.currentX + event.translationX,
        0,
        xBoundary,
      )
      translateY.value = clamp(
        context.currentY + event.translationY,
        0,
        yBoundary,
      )
    },
    onEnd: event => {
      translateX.value = withBouncing(
        withDecay({
          velocity: event.velocityX,
        }),
        0,
        xBoundary,
      )
      translateY.value = withBouncing(
        withDecay({
          velocity: event.velocityY,
        }),
        0,
        yBoundary,
      )
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
          <View style={styles.object} />
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
  object: {
    width: objectWidth,
    height: objectHeight,
    backgroundColor: "#bbb",
  },
})
