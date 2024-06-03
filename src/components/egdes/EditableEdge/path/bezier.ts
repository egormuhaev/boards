import { Position } from "reactflow";

//Данный код представляет собой две функции, которые используются для расчета контрольных точек кривых Безье.
// Эти функции могут быть использованы для создания кривых с различной кривизной и положением.
//  Рассмотрим их по строкам.

/*
Данная функция вычичсляет смещение относительно начальной чтоки
Имеется точка A и B. (начальная и конечная)
У точек соответсвенно есть координаты x1 y1 и x2 y2
Дистаниця будет вычисляться относительно позиции смещения (право, влево, вверх, низ)
Если (вверх) y1 - y2
Если (вниз) y2 - y1
Если (вправо) x1 - x2
Если (влево) x2 - x1
В случае если дистанция положительная то, мы берем середниу отрезка как новое положение точки
В случае если дистанция отрицательная то значит имеется сильный изгиб со смещением в отрицательную сторону
То нужно интерпалировать значение смещения с учетом коэфициента кривизны:
 1) Math.sqrt(-distance) - Квадратный корень из отрицательного расстояния -distance используется для
  обеспечения нелинейного роста смещения по мере увеличения отрицательного расстояния.
  Если расстояние маленькое, то смещение будет тоже небольшим.
  Если расстояние большое, то смещение растет быстрее, чем просто линейно.
  Математический смысл: Принимая квадратный корень, мы обеспечиваем, что смещение будет пропорционально квадратному корню из расстояния,
  что помогает избежать слишком резких изменений для небольших значений distance и более выраженных изменений для больших значений

  2) curvature - Этот коэффициент позволяет масштабировать смещение в зависимости от желаемой кривизны.
  Меньшие значения curvature (например, меньше 1) приведут к менее выраженным изгибам.
  Большие значения curvature (например, больше 1) приведут к более выраженным изгибам.
  Коэффициент кривизны позволяет гибко управлять степенью изгиба кривой.
  Это полезно для настройки кривой под конкретные требования визуализации.

  3) 25 - значение 25 является фиксированным множителем, который используется
  для масштабирования результата.
  - Этот множитель был выбран эмпирически для получения удобных размеров смещения при стандартных значениях кривизны и расстояния.
  - Это константа, которая определяет базовую величину смещения, чтобы конечные значения были в разумном диапазоне для большинства приложений.
  - Это значение можно подбирать экспериментально для различных приложений, но в данном случае оно задает масштаб смещения,
  чтобы сделать кривые визуально привлекательными и управляемыми.
*/

/*
Основыне математические операции данного модуля происхлдят в функции calculateControlOffset
Функция getControlWithCurvature позволяет получить новые координаты точки относиттельно его смещения,
Конструкция switch позволяет изменять только значение по определенным осям зависимо от направления смещения
*/
function calculateControlOffset(distance: number, curvature: number): number {
  if (distance >= 0) {
    return 0.5 * distance;
  }

  return curvature * 25 * Math.sqrt(-distance);
}

export function getControlWithCurvature(
  pos: Position,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  c: number,
): [number, number] {
  switch (pos) {
    case Position.Left:
      return [x1 - calculateControlOffset(x1 - x2, c), y1];
    case Position.Right:
      return [x1 + calculateControlOffset(x2 - x1, c), y1];
    case Position.Top:
      return [x1, y1 - calculateControlOffset(y1 - y2, c)];
    case Position.Bottom:
      return [x1, y1 + calculateControlOffset(y2 - y1, c)];
  }
}
