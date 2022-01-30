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

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height
const objectWidth = 300
const objectHeight = 150

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
    onEnd: event => {
      console.log(`on end`)
      translateX.value = withDecay({
        velocity: event.velocityX,
        clamp: [0, windowWidth - objectWidth],
      })
      translateY.value = withDecay({
        velocity: event.velocityY,
        clamp: [0, windowHeight - objectHeight],
      })
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
