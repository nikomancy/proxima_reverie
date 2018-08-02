!function(n){var t={};function e(g){if(t[g])return t[g].exports;var i=t[g]={i:g,l:!1,exports:{}};return n[g].call(i.exports,i,i.exports,e),i.l=!0,i.exports}e.m=n,e.c=t,e.d=function(n,t,g){e.o(n,t)||Object.defineProperty(n,t,{configurable:!1,enumerable:!0,get:g})},e.r=function(n){Object.defineProperty(n,"__esModule",{value:!0})},e.n=function(n){var t=n&&n.__esModule?function(){return n.default}:function(){return n};return e.d(t,"a",t),t},e.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},e.p="",e(e.s=0)}([function(module,__webpack_exports__,__webpack_require__){"use strict";eval("__webpack_require__.r(__webpack_exports__);\n\n// EXTERNAL MODULE: ./src/styles/index.css\nvar styles = __webpack_require__(2);\n\n// CONCATENATED MODULE: ./src/input.js\n\n\nconst Input = (function() {\n  let keysDown = [];\n  let keysPressed = [];\n  let mouseEvent = undefined;\n\n  function keyDown(keyCode) {\n    if (keysPressed.indexOf(keyCode) < 0) {\n      keysPressed.push(keyCode);\n    }\n    if (keysDown.indexOf(keyCode) < 0) {\n      keysDown.push(keyCode);\n    }\n  }\n\n  function keyUp(keyCode) {\n    keysDown = keysDown.filter(element => {\n      return element != keyCode;\n    });\n  }\n\n  function getKeysPressed() {\n    return keysDown.concat(\n      keysPressed.filter(key => {\n        return keysDown.indexOf(key) < 0;\n      })\n    );\n  }\n\n  function mouseUp(event) {\n    mouseEvent = event;\n  }\n\n  function getMouseEvent() {\n    return mouseEvent;\n  }\n\n  function resetInputs() {\n    keysPressed = [];\n    mouseEvent = undefined;\n  }\n\n  return {\n    keyDown: keyDown,\n    keyUp: keyUp,\n    getKeysPressed: getKeysPressed,\n    mouseUp: mouseUp,\n    getMouseEvent: getMouseEvent,\n    resetInputs: resetInputs\n  };\n})();\n\n// CONCATENATED MODULE: ./src/asset_manager.js\n\n\nconst Assets = (function() {\n  let assets = {};\n\n  function loadAssets(assetOwners, callback) {\n    let tempAssetPaths = [];\n    for (let assetOwner of assetOwners) {\n      tempAssetPaths = tempAssetPaths.concat(assetOwner.assetPaths);\n    }\n    let assetPaths = [...new Set(tempAssetPaths)];\n\n    let assetsRemaining = assetPaths.length;\n    for (let assetPath of assetPaths) {\n      let asset = new Image();\n      asset.onload = function() {\n        assets[assetPath] = asset;\n        assetsRemaining--;\n        if (assetsRemaining <= 0) {\n          callback();\n        }\n      };\n      asset.src = assetPath;\n    }\n  }\n\n  function get(assetPath) {\n    return assets[assetPath];\n  }\n\n  return {\n    loadAssets: loadAssets,\n    get: get\n  };\n})();\n\n// CONCATENATED MODULE: ./src/asset_owner.js\n\n\n\nclass AssetOwner {\n\n  constructor(assetPaths) {\n    this.assetPaths = assetPaths;\n  }\n\n}\n\n// CONCATENATED MODULE: ./src/tile.js\n\n\n\n\n\n\nclass tile_Tile extends AssetOwner {\n\n  constructor(assetPaths) {\n    super(assetPaths);\n    this.tileWidth = 128;\n    this.tileHeight = 64;\n    this.imageFrameIndex = 0;\n  }\n\n  get img() {\n    return Assets.get(this.assetPaths[this.imageFrameIndex]);\n  }\n\n}\n\n// CONCATENATED MODULE: ./src/util.js\n\n\nconst rand = max => {\n  return Math.floor(Math.random() * Math.floor(max));\n};\n\nconst coordsEqual = (a, b) => {\n  return a.x == b.x && a.y == b.y;\n};\n\n// CONCATENATED MODULE: ./src/map.js\n\n\n\n\nclass Map {\n  constructor(tiles, mapSize) {\n    this.tiles = tiles;\n    this.mapSize = mapSize;\n    this.tileWidth = tiles[0].tileWidth;\n    this.tileHeight = tiles[0].tileHeight;\n    this.mapDef = buildMapDef(this);\n  }\n\n  get mapCanvas() {\n    if (this.myMapCanvas == undefined) {\n      this.myMapCanvas = drawMapCanvas(this);\n    }\n    return this.myMapCanvas;\n  }\n\n  mapCoordsForTile(tileCoords) {\n    let xOffset = (this.mapSize * this.tileWidth) / 2 - this.tileWidth / 2;\n    let mapX = (tileCoords.x - tileCoords.y) * (this.tileWidth / 2) + xOffset;\n    let mapY = (tileCoords.x + tileCoords.y) * (this.tileHeight / 2);\n    return { x: mapX, y: mapY };\n  }\n\n  tileOffsets() {\n    return { x: this.tileWidth / 2, y: this.tileHeight / 2 };\n  }\n}\n\nfunction buildMapDef(map) {\n  let mapDef = [];\n  for (let i = 0; i < map.mapSize; i++) {\n    mapDef[i] = [];\n    for (let j = 0; j < map.mapSize; j++) {\n      mapDef[i][j] = map.tiles[rand(map.tiles.length)];\n    }\n  }\n  return mapDef;\n}\n\nfunction drawMapCanvas(map) {\n  let mapCanvas = document.createElement('canvas');\n  mapCanvas.width = map.mapSize * map.tileWidth - map.mapSize;\n  mapCanvas.height = map.mapSize * map.tileHeight - map.mapSize;\n\n  for (let [x, row] of map.mapDef.entries()) {\n    for (let [y, tile] of row.entries()) {\n      drawTile(map, mapCanvas.getContext('2d'), tile, x, y);\n    }\n  }\n  return mapCanvas;\n}\n\nfunction drawTile(map, context, tile, mapX, mapY) {\n  let contextCoords = map.mapCoordsForTile({ x: mapX, y: mapY });\n  context.drawImage(\n    tile.img,\n    contextCoords.x,\n    contextCoords.y,\n    map.tileWidth,\n    map.tileHeight\n  );\n}\n\n// CONCATENATED MODULE: ./src/entity.js\n\n\n\n\n\n\nclass entity_Entity extends AssetOwner {\n  constructor(entityDef, map) {\n    super(entityDef.imagePaths);\n    this.frameWidth = 60;\n    this.frameHeight = 110;\n    this.map = map;\n    this.currentTile = {\n      x: entityDef.startTile === undefined ? 0 : entityDef.startTile.x,\n      y: entityDef.startTile === undefined ? 0 : entityDef.startTile.y\n    };\n    this.location = this.findMapPositionForTile(this.currentTile);\n    this.tilePath = [];\n    this.destination = undefined;\n  }\n\n  get image() {\n    return Assets.get(this.assetPaths[0]);\n  }\n\n  get frameXOrigin() {\n    return 0;\n  }\n\n  get frameYOrigin() {\n    return 0;\n  }\n\n  respondToMouse(eventTile, blockingAnimationCallback) {\n    if (eventTile != undefined) {\n      this.tilePath = buildTilePath(this.currentTile, eventTile);\n      this.updateDestination();\n      blockingAnimationCallback(true);\n      this.blockingAnimationCallback = blockingAnimationCallback;\n    }\n  }\n\n  tick() {\n    if (this.destination != undefined) {\n      let dx = this.location.x - this.destination.x,\n        dy = this.location.y - this.destination.y;\n      let dist = Math.sqrt(dx * dx + dy * dy);\n      let velX = (dx / dist) * 5;\n      let velY = (dy / dist) * 5;\n      if (Math.abs(dx) < Math.abs(velX)) {\n        velX = dx;\n      }\n      if (Math.abs(dy) < Math.abs(velY)) {\n        velY = dy;\n      }\n      this.location.x -= velX;\n      this.location.y -= velY;\n      if (coordsEqual(this.location, this.destination)) {\n        this.currentTile = this.tilePath.shift();\n        this.updateDestination();\n      }\n    }\n  }\n\n  updateDestination() {\n    let nextTileDestination = this.tilePath[0];\n    if (nextTileDestination != undefined) {\n      this.destination = this.findMapPositionForTile(nextTileDestination);\n    } else {\n      this.destination = undefined;\n      this.blockingAnimationCallback(false);\n    }\n  }\n\n  findMapPositionForTile(tile) {\n    let mapDestination = this.map.mapCoordsForTile({ x: tile.x, y: tile.y });\n    let tileOffset = this.map.tileOffsets();\n    let frameOffset = { x: this.frameWidth / 2, y: this.frameHeight };\n    return {\n      x: mapDestination.x + tileOffset.x - frameOffset.x,\n      y: mapDestination.y + tileOffset.y - frameOffset.y\n    };\n  }\n}\n\n// Uses Brensenham's line algorithm\nfunction buildTilePath(start, end) {\n  let path = [];\n\n  let currentX = start.x,\n    currentY = start.y;\n  let deltaX = Math.abs(end.x - start.x),\n    deltaY = Math.abs(end.y - start.y);\n  let slopeX = start.x < end.x ? 1 : -1,\n    slopeY = start.y < end.y ? 1 : -1;\n  let err = deltaX - deltaY;\n\n  while (currentX != end.x || currentY != end.y) {\n    let err2 = 2 * err;\n    if (err2 > deltaY * -1) {\n      err -= deltaY;\n      currentX += slopeX;\n    } else if (err2 < deltaX) {\n      err += deltaX;\n      currentY += slopeY;\n    }\n    path.push({ x: currentX, y: currentY });\n  }\n  return path;\n}\n\n// CONCATENATED MODULE: ./src/scene.js\n\n\n\n\n\n\n\n\nclass scene_Scene {\n  constructor(sceneDef, viewport, viewportDimensions, loadCompleteCallback) {\n    let tiles = sceneDef.mapDef.tileImagePaths.map(tileImagePath => {\n      return new tile_Tile([tileImagePath]);\n    });\n\n    this.map = new Map(tiles, sceneDef.mapDef.mapSize);\n\n    this.mobiles = sceneDef.mobileDefs.map(mobileDef => {\n      return new entity_Entity(mobileDef, this.map);\n    });\n    this.activeMobile = this.mobiles[0];\n\n    this.viewport = viewport;\n    this.viewportDimensions = viewportDimensions;\n\n    Assets.loadAssets([...tiles, ...this.mobiles], () => {\n      this.viewportOffsetDimensions = {\n        x: this.map.mapCanvas.width / 2 - viewportDimensions.x / 2,\n        y: this.map.mapCanvas.height / 2 - viewportDimensions.y / 2\n      };\n      loadCompleteCallback();\n    });\n\n    this.waitingOnAnimation = false;\n  }\n\n  tick() {\n    // console.log('tick');\n\n    let mouseEvent = Input.getMouseEvent();\n    if (mouseEvent != undefined) {\n      let eventViewportPosition = getEventViewportPosition(\n        this.viewport,\n        mouseEvent\n      );\n      let eventMapPosition = getCursorMapPosition(\n        this.viewportOffsetDimensions,\n        eventViewportPosition\n      );\n      let tilePosition = getCursorTilePosition(this.map, eventMapPosition);\n\n      if (!this.waitingOnAnimation) {\n        this.activeMobile.respondToMouse(tilePosition, shouldWait => {\n          this.waitingOnAnimation = shouldWait;\n        });\n\n        if (this.mobiles.slice(-1)[0] == this.activeMobile) {\n          this.activeMobile = this.mobiles[0];\n        } else {\n          this.activeMobile = this.mobiles[\n            this.mobiles.indexOf(this.activeMobile) + 1\n          ];\n        }\n      }\n    }\n\n    this.mobiles.forEach(mobile => {\n      mobile.tick();\n    });\n\n    let context = this.viewport.getContext('2d');\n    context.clearRect(\n      0,\n      0,\n      this.viewportDimensions.x,\n      this.viewportDimensions.y\n    );\n    context.drawImage(\n      this.map.mapCanvas,\n      this.viewportOffsetDimensions.x,\n      this.viewportOffsetDimensions.y,\n      this.viewportDimensions.x,\n      this.viewportDimensions.y,\n      0,\n      0,\n      this.viewportDimensions.x,\n      this.viewportDimensions.y\n    );\n\n    this.mobiles.forEach(mobile => {\n      context.drawImage(\n        mobile.image,\n        mobile.frameXOrigin,\n        mobile.frameYOrigin,\n        mobile.frameWidth,\n        mobile.frameHeight,\n        mobile.location.x - this.viewportOffsetDimensions.x,\n        mobile.location.y - this.viewportOffsetDimensions.y,\n        mobile.frameWidth,\n        mobile.frameHeight\n      );\n    });\n\n    Input.resetInputs();\n  }\n}\n\nfunction getCursorMapPosition(viewOffsets, position) {\n  return { x: viewOffsets.x + position.x, y: viewOffsets.y + position.y };\n}\n\nfunction getCursorTilePosition(map, position) {\n  let halfTileWidth = map.tileWidth / 2;\n  let halfTileHeight = map.tileHeight / 2;\n  let halfMapSize = map.mapSize / 2;\n  let tileX =\n    (position.x / halfTileWidth + position.y / halfTileHeight) / 2 -\n    halfMapSize;\n  let tileY =\n    (position.y / halfTileHeight - position.x / halfTileWidth) / 2 +\n    halfMapSize;\n  return { x: Math.floor(tileX), y: Math.floor(tileY) };\n}\n\nfunction getEventViewportPosition(viewport, event) {\n  let rect = viewport.getBoundingClientRect();\n  let x = event.clientX - rect.left;\n  let y = event.clientY - rect.top;\n  return { x: x, y: y };\n}\n\n// CONCATENATED MODULE: ./src/scene_definition.js\n\n\nconst scene_definition_sceneDef = {\n  mapDef: {\n    mapSize: 10,\n    tileImagePaths: [\n      './src/img/ground_tiles/brickpavers2.png',\n      './src/img/ground_tiles/concrete368a.png',\n      './src/img/ground_tiles/cretebrick970.png',\n      './src/img/ground_tiles/dirt.png',\n      './src/img/ground_tiles/dirtsand2.png',\n      './src/img/ground_tiles/rock.png',\n      './src/img/ground_tiles/snow.png',\n      './src/img/ground_tiles/stone.png'\n    ]\n  },\n  mobileDefs: [\n    {\n      imagePaths: ['./src/img/mobiles/8way_mobile.png'],\n      startTile: { x: 3, y: 3 }\n    },\n    {\n      imagePaths: ['./src/img/mobiles/8way_mobile.png'],\n      startTile: { x: 5, y: 4 }\n    },\n    {\n      imagePaths: ['./src/img/mobiles/8way_mobile.png'],\n      startTile: { x: 3, y: 6 }\n    }\n  ]\n};\n\n// CONCATENATED MODULE: ./src/index.js\n\n\n\n\n\n\n\n\ndocument.addEventListener('DOMContentLoaded', function() {\n  console.log('Proxma Reverie approaches!');\n\n  let tickLength = 50;\n\n  var viewport = document.getElementById('viewport-canvas');\n  let viewportDimensions = { x: 600, y: 400 };\n  viewport.width = viewportDimensions.x;\n  viewport.height = viewportDimensions.y;\n\n  let scene = new scene_Scene(scene_definition_sceneDef, viewport, viewportDimensions, () => {\n    setTimeout(() => {\n      tick();\n    }, 0);\n  });\n\n  function tick() {\n    scene.tick();\n    setTimeout(() => {\n      tick();\n    }, tickLength);\n  }\n\n  document.addEventListener('keydown', event => {\n    Input.keyDown(event.key);\n  });\n\n  document.addEventListener('keyup', event => {\n    Input.keyUp(event.key);\n  });\n\n  viewport.addEventListener('mouseup', event => {\n    Input.mouseUp(event);\n  });\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9pbnB1dC5qcz85ZWY4Iiwid2VicGFjazovLy8uL3NyYy9hc3NldF9tYW5hZ2VyLmpzP2FlMGMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fzc2V0X293bmVyLmpzPzc0YTIiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RpbGUuanM/MGM4MCIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbC5qcz9lMGViIiwid2VicGFjazovLy8uL3NyYy9tYXAuanM/MThiYSIsIndlYnBhY2s6Ly8vLi9zcmMvZW50aXR5LmpzPzYyN2EiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjZW5lLmpzPzI2NGMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjZW5lX2RlZmluaXRpb24uanM/NGI4ZiIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanM/YjYzNSJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBjb25zdCBJbnB1dCA9IChmdW5jdGlvbigpIHtcbiAgbGV0IGtleXNEb3duID0gW107XG4gIGxldCBrZXlzUHJlc3NlZCA9IFtdO1xuICBsZXQgbW91c2VFdmVudCA9IHVuZGVmaW5lZDtcblxuICBmdW5jdGlvbiBrZXlEb3duKGtleUNvZGUpIHtcbiAgICBpZiAoa2V5c1ByZXNzZWQuaW5kZXhPZihrZXlDb2RlKSA8IDApIHtcbiAgICAgIGtleXNQcmVzc2VkLnB1c2goa2V5Q29kZSk7XG4gICAgfVxuICAgIGlmIChrZXlzRG93bi5pbmRleE9mKGtleUNvZGUpIDwgMCkge1xuICAgICAga2V5c0Rvd24ucHVzaChrZXlDb2RlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBrZXlVcChrZXlDb2RlKSB7XG4gICAga2V5c0Rvd24gPSBrZXlzRG93bi5maWx0ZXIoZWxlbWVudCA9PiB7XG4gICAgICByZXR1cm4gZWxlbWVudCAhPSBrZXlDb2RlO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0S2V5c1ByZXNzZWQoKSB7XG4gICAgcmV0dXJuIGtleXNEb3duLmNvbmNhdChcbiAgICAgIGtleXNQcmVzc2VkLmZpbHRlcihrZXkgPT4ge1xuICAgICAgICByZXR1cm4ga2V5c0Rvd24uaW5kZXhPZihrZXkpIDwgMDtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1vdXNlVXAoZXZlbnQpIHtcbiAgICBtb3VzZUV2ZW50ID0gZXZlbnQ7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRNb3VzZUV2ZW50KCkge1xuICAgIHJldHVybiBtb3VzZUV2ZW50O1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRJbnB1dHMoKSB7XG4gICAga2V5c1ByZXNzZWQgPSBbXTtcbiAgICBtb3VzZUV2ZW50ID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBrZXlEb3duOiBrZXlEb3duLFxuICAgIGtleVVwOiBrZXlVcCxcbiAgICBnZXRLZXlzUHJlc3NlZDogZ2V0S2V5c1ByZXNzZWQsXG4gICAgbW91c2VVcDogbW91c2VVcCxcbiAgICBnZXRNb3VzZUV2ZW50OiBnZXRNb3VzZUV2ZW50LFxuICAgIHJlc2V0SW5wdXRzOiByZXNldElucHV0c1xuICB9O1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGNvbnN0IEFzc2V0cyA9IChmdW5jdGlvbigpIHtcbiAgbGV0IGFzc2V0cyA9IHt9O1xuXG4gIGZ1bmN0aW9uIGxvYWRBc3NldHMoYXNzZXRPd25lcnMsIGNhbGxiYWNrKSB7XG4gICAgbGV0IHRlbXBBc3NldFBhdGhzID0gW107XG4gICAgZm9yIChsZXQgYXNzZXRPd25lciBvZiBhc3NldE93bmVycykge1xuICAgICAgdGVtcEFzc2V0UGF0aHMgPSB0ZW1wQXNzZXRQYXRocy5jb25jYXQoYXNzZXRPd25lci5hc3NldFBhdGhzKTtcbiAgICB9XG4gICAgbGV0IGFzc2V0UGF0aHMgPSBbLi4ubmV3IFNldCh0ZW1wQXNzZXRQYXRocyldO1xuXG4gICAgbGV0IGFzc2V0c1JlbWFpbmluZyA9IGFzc2V0UGF0aHMubGVuZ3RoO1xuICAgIGZvciAobGV0IGFzc2V0UGF0aCBvZiBhc3NldFBhdGhzKSB7XG4gICAgICBsZXQgYXNzZXQgPSBuZXcgSW1hZ2UoKTtcbiAgICAgIGFzc2V0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBhc3NldHNbYXNzZXRQYXRoXSA9IGFzc2V0O1xuICAgICAgICBhc3NldHNSZW1haW5pbmctLTtcbiAgICAgICAgaWYgKGFzc2V0c1JlbWFpbmluZyA8PSAwKSB7XG4gICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGFzc2V0LnNyYyA9IGFzc2V0UGF0aDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXQoYXNzZXRQYXRoKSB7XG4gICAgcmV0dXJuIGFzc2V0c1thc3NldFBhdGhdO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBsb2FkQXNzZXRzOiBsb2FkQXNzZXRzLFxuICAgIGdldDogZ2V0XG4gIH07XG59KSgpO1xuIiwiXG5cInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXNzZXRPd25lciB7XG5cbiAgY29uc3RydWN0b3IoYXNzZXRQYXRocykge1xuICAgIHRoaXMuYXNzZXRQYXRocyA9IGFzc2V0UGF0aHM7XG4gIH1cblxufVxuIiwiXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IHsgQXNzZXRzIH0gZnJvbSBcIi4vYXNzZXRfbWFuYWdlclwiO1xuaW1wb3J0IEFzc2V0T3duZXIgZnJvbSBcIi4vYXNzZXRfb3duZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlsZSBleHRlbmRzIEFzc2V0T3duZXIge1xuXG4gIGNvbnN0cnVjdG9yKGFzc2V0UGF0aHMpIHtcbiAgICBzdXBlcihhc3NldFBhdGhzKTtcbiAgICB0aGlzLnRpbGVXaWR0aCA9IDEyODtcbiAgICB0aGlzLnRpbGVIZWlnaHQgPSA2NDtcbiAgICB0aGlzLmltYWdlRnJhbWVJbmRleCA9IDA7XG4gIH1cblxuICBnZXQgaW1nKCkge1xuICAgIHJldHVybiBBc3NldHMuZ2V0KHRoaXMuYXNzZXRQYXRoc1t0aGlzLmltYWdlRnJhbWVJbmRleF0pO1xuICB9XG5cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGNvbnN0IHJhbmQgPSBtYXggPT4ge1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogTWF0aC5mbG9vcihtYXgpKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjb29yZHNFcXVhbCA9IChhLCBiKSA9PiB7XG4gIHJldHVybiBhLnggPT0gYi54ICYmIGEueSA9PSBiLnk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgeyByYW5kIH0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFwIHtcbiAgY29uc3RydWN0b3IodGlsZXMsIG1hcFNpemUpIHtcbiAgICB0aGlzLnRpbGVzID0gdGlsZXM7XG4gICAgdGhpcy5tYXBTaXplID0gbWFwU2l6ZTtcbiAgICB0aGlzLnRpbGVXaWR0aCA9IHRpbGVzWzBdLnRpbGVXaWR0aDtcbiAgICB0aGlzLnRpbGVIZWlnaHQgPSB0aWxlc1swXS50aWxlSGVpZ2h0O1xuICAgIHRoaXMubWFwRGVmID0gYnVpbGRNYXBEZWYodGhpcyk7XG4gIH1cblxuICBnZXQgbWFwQ2FudmFzKCkge1xuICAgIGlmICh0aGlzLm15TWFwQ2FudmFzID09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5teU1hcENhbnZhcyA9IGRyYXdNYXBDYW52YXModGhpcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm15TWFwQ2FudmFzO1xuICB9XG5cbiAgbWFwQ29vcmRzRm9yVGlsZSh0aWxlQ29vcmRzKSB7XG4gICAgbGV0IHhPZmZzZXQgPSAodGhpcy5tYXBTaXplICogdGhpcy50aWxlV2lkdGgpIC8gMiAtIHRoaXMudGlsZVdpZHRoIC8gMjtcbiAgICBsZXQgbWFwWCA9ICh0aWxlQ29vcmRzLnggLSB0aWxlQ29vcmRzLnkpICogKHRoaXMudGlsZVdpZHRoIC8gMikgKyB4T2Zmc2V0O1xuICAgIGxldCBtYXBZID0gKHRpbGVDb29yZHMueCArIHRpbGVDb29yZHMueSkgKiAodGhpcy50aWxlSGVpZ2h0IC8gMik7XG4gICAgcmV0dXJuIHsgeDogbWFwWCwgeTogbWFwWSB9O1xuICB9XG5cbiAgdGlsZU9mZnNldHMoKSB7XG4gICAgcmV0dXJuIHsgeDogdGhpcy50aWxlV2lkdGggLyAyLCB5OiB0aGlzLnRpbGVIZWlnaHQgLyAyIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gYnVpbGRNYXBEZWYobWFwKSB7XG4gIGxldCBtYXBEZWYgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXAubWFwU2l6ZTsgaSsrKSB7XG4gICAgbWFwRGVmW2ldID0gW107XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBtYXAubWFwU2l6ZTsgaisrKSB7XG4gICAgICBtYXBEZWZbaV1bal0gPSBtYXAudGlsZXNbcmFuZChtYXAudGlsZXMubGVuZ3RoKV07XG4gICAgfVxuICB9XG4gIHJldHVybiBtYXBEZWY7XG59XG5cbmZ1bmN0aW9uIGRyYXdNYXBDYW52YXMobWFwKSB7XG4gIGxldCBtYXBDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgbWFwQ2FudmFzLndpZHRoID0gbWFwLm1hcFNpemUgKiBtYXAudGlsZVdpZHRoIC0gbWFwLm1hcFNpemU7XG4gIG1hcENhbnZhcy5oZWlnaHQgPSBtYXAubWFwU2l6ZSAqIG1hcC50aWxlSGVpZ2h0IC0gbWFwLm1hcFNpemU7XG5cbiAgZm9yIChsZXQgW3gsIHJvd10gb2YgbWFwLm1hcERlZi5lbnRyaWVzKCkpIHtcbiAgICBmb3IgKGxldCBbeSwgdGlsZV0gb2Ygcm93LmVudHJpZXMoKSkge1xuICAgICAgZHJhd1RpbGUobWFwLCBtYXBDYW52YXMuZ2V0Q29udGV4dCgnMmQnKSwgdGlsZSwgeCwgeSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBtYXBDYW52YXM7XG59XG5cbmZ1bmN0aW9uIGRyYXdUaWxlKG1hcCwgY29udGV4dCwgdGlsZSwgbWFwWCwgbWFwWSkge1xuICBsZXQgY29udGV4dENvb3JkcyA9IG1hcC5tYXBDb29yZHNGb3JUaWxlKHsgeDogbWFwWCwgeTogbWFwWSB9KTtcbiAgY29udGV4dC5kcmF3SW1hZ2UoXG4gICAgdGlsZS5pbWcsXG4gICAgY29udGV4dENvb3Jkcy54LFxuICAgIGNvbnRleHRDb29yZHMueSxcbiAgICBtYXAudGlsZVdpZHRoLFxuICAgIG1hcC50aWxlSGVpZ2h0XG4gICk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7IEFzc2V0cyB9IGZyb20gJy4vYXNzZXRfbWFuYWdlcic7XG5pbXBvcnQgQXNzZXRPd25lciBmcm9tICcuL2Fzc2V0X293bmVyJztcbmltcG9ydCB7IGNvb3Jkc0VxdWFsIH0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW50aXR5IGV4dGVuZHMgQXNzZXRPd25lciB7XG4gIGNvbnN0cnVjdG9yKGVudGl0eURlZiwgbWFwKSB7XG4gICAgc3VwZXIoZW50aXR5RGVmLmltYWdlUGF0aHMpO1xuICAgIHRoaXMuZnJhbWVXaWR0aCA9IDYwO1xuICAgIHRoaXMuZnJhbWVIZWlnaHQgPSAxMTA7XG4gICAgdGhpcy5tYXAgPSBtYXA7XG4gICAgdGhpcy5jdXJyZW50VGlsZSA9IHtcbiAgICAgIHg6IGVudGl0eURlZi5zdGFydFRpbGUgPT09IHVuZGVmaW5lZCA/IDAgOiBlbnRpdHlEZWYuc3RhcnRUaWxlLngsXG4gICAgICB5OiBlbnRpdHlEZWYuc3RhcnRUaWxlID09PSB1bmRlZmluZWQgPyAwIDogZW50aXR5RGVmLnN0YXJ0VGlsZS55XG4gICAgfTtcbiAgICB0aGlzLmxvY2F0aW9uID0gdGhpcy5maW5kTWFwUG9zaXRpb25Gb3JUaWxlKHRoaXMuY3VycmVudFRpbGUpO1xuICAgIHRoaXMudGlsZVBhdGggPSBbXTtcbiAgICB0aGlzLmRlc3RpbmF0aW9uID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0IGltYWdlKCkge1xuICAgIHJldHVybiBBc3NldHMuZ2V0KHRoaXMuYXNzZXRQYXRoc1swXSk7XG4gIH1cblxuICBnZXQgZnJhbWVYT3JpZ2luKCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZ2V0IGZyYW1lWU9yaWdpbigpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHJlc3BvbmRUb01vdXNlKGV2ZW50VGlsZSwgYmxvY2tpbmdBbmltYXRpb25DYWxsYmFjaykge1xuICAgIGlmIChldmVudFRpbGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnRpbGVQYXRoID0gYnVpbGRUaWxlUGF0aCh0aGlzLmN1cnJlbnRUaWxlLCBldmVudFRpbGUpO1xuICAgICAgdGhpcy51cGRhdGVEZXN0aW5hdGlvbigpO1xuICAgICAgYmxvY2tpbmdBbmltYXRpb25DYWxsYmFjayh0cnVlKTtcbiAgICAgIHRoaXMuYmxvY2tpbmdBbmltYXRpb25DYWxsYmFjayA9IGJsb2NraW5nQW5pbWF0aW9uQ2FsbGJhY2s7XG4gICAgfVxuICB9XG5cbiAgdGljaygpIHtcbiAgICBpZiAodGhpcy5kZXN0aW5hdGlvbiAhPSB1bmRlZmluZWQpIHtcbiAgICAgIGxldCBkeCA9IHRoaXMubG9jYXRpb24ueCAtIHRoaXMuZGVzdGluYXRpb24ueCxcbiAgICAgICAgZHkgPSB0aGlzLmxvY2F0aW9uLnkgLSB0aGlzLmRlc3RpbmF0aW9uLnk7XG4gICAgICBsZXQgZGlzdCA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG4gICAgICBsZXQgdmVsWCA9IChkeCAvIGRpc3QpICogNTtcbiAgICAgIGxldCB2ZWxZID0gKGR5IC8gZGlzdCkgKiA1O1xuICAgICAgaWYgKE1hdGguYWJzKGR4KSA8IE1hdGguYWJzKHZlbFgpKSB7XG4gICAgICAgIHZlbFggPSBkeDtcbiAgICAgIH1cbiAgICAgIGlmIChNYXRoLmFicyhkeSkgPCBNYXRoLmFicyh2ZWxZKSkge1xuICAgICAgICB2ZWxZID0gZHk7XG4gICAgICB9XG4gICAgICB0aGlzLmxvY2F0aW9uLnggLT0gdmVsWDtcbiAgICAgIHRoaXMubG9jYXRpb24ueSAtPSB2ZWxZO1xuICAgICAgaWYgKGNvb3Jkc0VxdWFsKHRoaXMubG9jYXRpb24sIHRoaXMuZGVzdGluYXRpb24pKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFRpbGUgPSB0aGlzLnRpbGVQYXRoLnNoaWZ0KCk7XG4gICAgICAgIHRoaXMudXBkYXRlRGVzdGluYXRpb24oKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1cGRhdGVEZXN0aW5hdGlvbigpIHtcbiAgICBsZXQgbmV4dFRpbGVEZXN0aW5hdGlvbiA9IHRoaXMudGlsZVBhdGhbMF07XG4gICAgaWYgKG5leHRUaWxlRGVzdGluYXRpb24gIT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uID0gdGhpcy5maW5kTWFwUG9zaXRpb25Gb3JUaWxlKG5leHRUaWxlRGVzdGluYXRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5ibG9ja2luZ0FuaW1hdGlvbkNhbGxiYWNrKGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICBmaW5kTWFwUG9zaXRpb25Gb3JUaWxlKHRpbGUpIHtcbiAgICBsZXQgbWFwRGVzdGluYXRpb24gPSB0aGlzLm1hcC5tYXBDb29yZHNGb3JUaWxlKHsgeDogdGlsZS54LCB5OiB0aWxlLnkgfSk7XG4gICAgbGV0IHRpbGVPZmZzZXQgPSB0aGlzLm1hcC50aWxlT2Zmc2V0cygpO1xuICAgIGxldCBmcmFtZU9mZnNldCA9IHsgeDogdGhpcy5mcmFtZVdpZHRoIC8gMiwgeTogdGhpcy5mcmFtZUhlaWdodCB9O1xuICAgIHJldHVybiB7XG4gICAgICB4OiBtYXBEZXN0aW5hdGlvbi54ICsgdGlsZU9mZnNldC54IC0gZnJhbWVPZmZzZXQueCxcbiAgICAgIHk6IG1hcERlc3RpbmF0aW9uLnkgKyB0aWxlT2Zmc2V0LnkgLSBmcmFtZU9mZnNldC55XG4gICAgfTtcbiAgfVxufVxuXG4vLyBVc2VzIEJyZW5zZW5oYW0ncyBsaW5lIGFsZ29yaXRobVxuZnVuY3Rpb24gYnVpbGRUaWxlUGF0aChzdGFydCwgZW5kKSB7XG4gIGxldCBwYXRoID0gW107XG5cbiAgbGV0IGN1cnJlbnRYID0gc3RhcnQueCxcbiAgICBjdXJyZW50WSA9IHN0YXJ0Lnk7XG4gIGxldCBkZWx0YVggPSBNYXRoLmFicyhlbmQueCAtIHN0YXJ0LngpLFxuICAgIGRlbHRhWSA9IE1hdGguYWJzKGVuZC55IC0gc3RhcnQueSk7XG4gIGxldCBzbG9wZVggPSBzdGFydC54IDwgZW5kLnggPyAxIDogLTEsXG4gICAgc2xvcGVZID0gc3RhcnQueSA8IGVuZC55ID8gMSA6IC0xO1xuICBsZXQgZXJyID0gZGVsdGFYIC0gZGVsdGFZO1xuXG4gIHdoaWxlIChjdXJyZW50WCAhPSBlbmQueCB8fCBjdXJyZW50WSAhPSBlbmQueSkge1xuICAgIGxldCBlcnIyID0gMiAqIGVycjtcbiAgICBpZiAoZXJyMiA+IGRlbHRhWSAqIC0xKSB7XG4gICAgICBlcnIgLT0gZGVsdGFZO1xuICAgICAgY3VycmVudFggKz0gc2xvcGVYO1xuICAgIH0gZWxzZSBpZiAoZXJyMiA8IGRlbHRhWCkge1xuICAgICAgZXJyICs9IGRlbHRhWDtcbiAgICAgIGN1cnJlbnRZICs9IHNsb3BlWTtcbiAgICB9XG4gICAgcGF0aC5wdXNoKHsgeDogY3VycmVudFgsIHk6IGN1cnJlbnRZIH0pO1xuICB9XG4gIHJldHVybiBwYXRoO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgVGlsZSBmcm9tICcuL3RpbGUnO1xuaW1wb3J0IE1hcCBmcm9tICcuL21hcCc7XG5pbXBvcnQgRW50aXR5IGZyb20gJy4vZW50aXR5JztcbmltcG9ydCB7IEFzc2V0cyB9IGZyb20gJy4vYXNzZXRfbWFuYWdlcic7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gJy4vaW5wdXQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2VuZSB7XG4gIGNvbnN0cnVjdG9yKHNjZW5lRGVmLCB2aWV3cG9ydCwgdmlld3BvcnREaW1lbnNpb25zLCBsb2FkQ29tcGxldGVDYWxsYmFjaykge1xuICAgIGxldCB0aWxlcyA9IHNjZW5lRGVmLm1hcERlZi50aWxlSW1hZ2VQYXRocy5tYXAodGlsZUltYWdlUGF0aCA9PiB7XG4gICAgICByZXR1cm4gbmV3IFRpbGUoW3RpbGVJbWFnZVBhdGhdKTtcbiAgICB9KTtcblxuICAgIHRoaXMubWFwID0gbmV3IE1hcCh0aWxlcywgc2NlbmVEZWYubWFwRGVmLm1hcFNpemUpO1xuXG4gICAgdGhpcy5tb2JpbGVzID0gc2NlbmVEZWYubW9iaWxlRGVmcy5tYXAobW9iaWxlRGVmID0+IHtcbiAgICAgIHJldHVybiBuZXcgRW50aXR5KG1vYmlsZURlZiwgdGhpcy5tYXApO1xuICAgIH0pO1xuICAgIHRoaXMuYWN0aXZlTW9iaWxlID0gdGhpcy5tb2JpbGVzWzBdO1xuXG4gICAgdGhpcy52aWV3cG9ydCA9IHZpZXdwb3J0O1xuICAgIHRoaXMudmlld3BvcnREaW1lbnNpb25zID0gdmlld3BvcnREaW1lbnNpb25zO1xuXG4gICAgQXNzZXRzLmxvYWRBc3NldHMoWy4uLnRpbGVzLCAuLi50aGlzLm1vYmlsZXNdLCAoKSA9PiB7XG4gICAgICB0aGlzLnZpZXdwb3J0T2Zmc2V0RGltZW5zaW9ucyA9IHtcbiAgICAgICAgeDogdGhpcy5tYXAubWFwQ2FudmFzLndpZHRoIC8gMiAtIHZpZXdwb3J0RGltZW5zaW9ucy54IC8gMixcbiAgICAgICAgeTogdGhpcy5tYXAubWFwQ2FudmFzLmhlaWdodCAvIDIgLSB2aWV3cG9ydERpbWVuc2lvbnMueSAvIDJcbiAgICAgIH07XG4gICAgICBsb2FkQ29tcGxldGVDYWxsYmFjaygpO1xuICAgIH0pO1xuXG4gICAgdGhpcy53YWl0aW5nT25BbmltYXRpb24gPSBmYWxzZTtcbiAgfVxuXG4gIHRpY2soKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ3RpY2snKTtcblxuICAgIGxldCBtb3VzZUV2ZW50ID0gSW5wdXQuZ2V0TW91c2VFdmVudCgpO1xuICAgIGlmIChtb3VzZUV2ZW50ICE9IHVuZGVmaW5lZCkge1xuICAgICAgbGV0IGV2ZW50Vmlld3BvcnRQb3NpdGlvbiA9IGdldEV2ZW50Vmlld3BvcnRQb3NpdGlvbihcbiAgICAgICAgdGhpcy52aWV3cG9ydCxcbiAgICAgICAgbW91c2VFdmVudFxuICAgICAgKTtcbiAgICAgIGxldCBldmVudE1hcFBvc2l0aW9uID0gZ2V0Q3Vyc29yTWFwUG9zaXRpb24oXG4gICAgICAgIHRoaXMudmlld3BvcnRPZmZzZXREaW1lbnNpb25zLFxuICAgICAgICBldmVudFZpZXdwb3J0UG9zaXRpb25cbiAgICAgICk7XG4gICAgICBsZXQgdGlsZVBvc2l0aW9uID0gZ2V0Q3Vyc29yVGlsZVBvc2l0aW9uKHRoaXMubWFwLCBldmVudE1hcFBvc2l0aW9uKTtcblxuICAgICAgaWYgKCF0aGlzLndhaXRpbmdPbkFuaW1hdGlvbikge1xuICAgICAgICB0aGlzLmFjdGl2ZU1vYmlsZS5yZXNwb25kVG9Nb3VzZSh0aWxlUG9zaXRpb24sIHNob3VsZFdhaXQgPT4ge1xuICAgICAgICAgIHRoaXMud2FpdGluZ09uQW5pbWF0aW9uID0gc2hvdWxkV2FpdDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMubW9iaWxlcy5zbGljZSgtMSlbMF0gPT0gdGhpcy5hY3RpdmVNb2JpbGUpIHtcbiAgICAgICAgICB0aGlzLmFjdGl2ZU1vYmlsZSA9IHRoaXMubW9iaWxlc1swXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmFjdGl2ZU1vYmlsZSA9IHRoaXMubW9iaWxlc1tcbiAgICAgICAgICAgIHRoaXMubW9iaWxlcy5pbmRleE9mKHRoaXMuYWN0aXZlTW9iaWxlKSArIDFcbiAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5tb2JpbGVzLmZvckVhY2gobW9iaWxlID0+IHtcbiAgICAgIG1vYmlsZS50aWNrKCk7XG4gICAgfSk7XG5cbiAgICBsZXQgY29udGV4dCA9IHRoaXMudmlld3BvcnQuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb250ZXh0LmNsZWFyUmVjdChcbiAgICAgIDAsXG4gICAgICAwLFxuICAgICAgdGhpcy52aWV3cG9ydERpbWVuc2lvbnMueCxcbiAgICAgIHRoaXMudmlld3BvcnREaW1lbnNpb25zLnlcbiAgICApO1xuICAgIGNvbnRleHQuZHJhd0ltYWdlKFxuICAgICAgdGhpcy5tYXAubWFwQ2FudmFzLFxuICAgICAgdGhpcy52aWV3cG9ydE9mZnNldERpbWVuc2lvbnMueCxcbiAgICAgIHRoaXMudmlld3BvcnRPZmZzZXREaW1lbnNpb25zLnksXG4gICAgICB0aGlzLnZpZXdwb3J0RGltZW5zaW9ucy54LFxuICAgICAgdGhpcy52aWV3cG9ydERpbWVuc2lvbnMueSxcbiAgICAgIDAsXG4gICAgICAwLFxuICAgICAgdGhpcy52aWV3cG9ydERpbWVuc2lvbnMueCxcbiAgICAgIHRoaXMudmlld3BvcnREaW1lbnNpb25zLnlcbiAgICApO1xuXG4gICAgdGhpcy5tb2JpbGVzLmZvckVhY2gobW9iaWxlID0+IHtcbiAgICAgIGNvbnRleHQuZHJhd0ltYWdlKFxuICAgICAgICBtb2JpbGUuaW1hZ2UsXG4gICAgICAgIG1vYmlsZS5mcmFtZVhPcmlnaW4sXG4gICAgICAgIG1vYmlsZS5mcmFtZVlPcmlnaW4sXG4gICAgICAgIG1vYmlsZS5mcmFtZVdpZHRoLFxuICAgICAgICBtb2JpbGUuZnJhbWVIZWlnaHQsXG4gICAgICAgIG1vYmlsZS5sb2NhdGlvbi54IC0gdGhpcy52aWV3cG9ydE9mZnNldERpbWVuc2lvbnMueCxcbiAgICAgICAgbW9iaWxlLmxvY2F0aW9uLnkgLSB0aGlzLnZpZXdwb3J0T2Zmc2V0RGltZW5zaW9ucy55LFxuICAgICAgICBtb2JpbGUuZnJhbWVXaWR0aCxcbiAgICAgICAgbW9iaWxlLmZyYW1lSGVpZ2h0XG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgSW5wdXQucmVzZXRJbnB1dHMoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRDdXJzb3JNYXBQb3NpdGlvbih2aWV3T2Zmc2V0cywgcG9zaXRpb24pIHtcbiAgcmV0dXJuIHsgeDogdmlld09mZnNldHMueCArIHBvc2l0aW9uLngsIHk6IHZpZXdPZmZzZXRzLnkgKyBwb3NpdGlvbi55IH07XG59XG5cbmZ1bmN0aW9uIGdldEN1cnNvclRpbGVQb3NpdGlvbihtYXAsIHBvc2l0aW9uKSB7XG4gIGxldCBoYWxmVGlsZVdpZHRoID0gbWFwLnRpbGVXaWR0aCAvIDI7XG4gIGxldCBoYWxmVGlsZUhlaWdodCA9IG1hcC50aWxlSGVpZ2h0IC8gMjtcbiAgbGV0IGhhbGZNYXBTaXplID0gbWFwLm1hcFNpemUgLyAyO1xuICBsZXQgdGlsZVggPVxuICAgIChwb3NpdGlvbi54IC8gaGFsZlRpbGVXaWR0aCArIHBvc2l0aW9uLnkgLyBoYWxmVGlsZUhlaWdodCkgLyAyIC1cbiAgICBoYWxmTWFwU2l6ZTtcbiAgbGV0IHRpbGVZID1cbiAgICAocG9zaXRpb24ueSAvIGhhbGZUaWxlSGVpZ2h0IC0gcG9zaXRpb24ueCAvIGhhbGZUaWxlV2lkdGgpIC8gMiArXG4gICAgaGFsZk1hcFNpemU7XG4gIHJldHVybiB7IHg6IE1hdGguZmxvb3IodGlsZVgpLCB5OiBNYXRoLmZsb29yKHRpbGVZKSB9O1xufVxuXG5mdW5jdGlvbiBnZXRFdmVudFZpZXdwb3J0UG9zaXRpb24odmlld3BvcnQsIGV2ZW50KSB7XG4gIGxldCByZWN0ID0gdmlld3BvcnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGxldCB4ID0gZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgbGV0IHkgPSBldmVudC5jbGllbnRZIC0gcmVjdC50b3A7XG4gIHJldHVybiB7IHg6IHgsIHk6IHkgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGNvbnN0IHNjZW5lRGVmID0ge1xuICBtYXBEZWY6IHtcbiAgICBtYXBTaXplOiAxMCxcbiAgICB0aWxlSW1hZ2VQYXRoczogW1xuICAgICAgJy4vc3JjL2ltZy9ncm91bmRfdGlsZXMvYnJpY2twYXZlcnMyLnBuZycsXG4gICAgICAnLi9zcmMvaW1nL2dyb3VuZF90aWxlcy9jb25jcmV0ZTM2OGEucG5nJyxcbiAgICAgICcuL3NyYy9pbWcvZ3JvdW5kX3RpbGVzL2NyZXRlYnJpY2s5NzAucG5nJyxcbiAgICAgICcuL3NyYy9pbWcvZ3JvdW5kX3RpbGVzL2RpcnQucG5nJyxcbiAgICAgICcuL3NyYy9pbWcvZ3JvdW5kX3RpbGVzL2RpcnRzYW5kMi5wbmcnLFxuICAgICAgJy4vc3JjL2ltZy9ncm91bmRfdGlsZXMvcm9jay5wbmcnLFxuICAgICAgJy4vc3JjL2ltZy9ncm91bmRfdGlsZXMvc25vdy5wbmcnLFxuICAgICAgJy4vc3JjL2ltZy9ncm91bmRfdGlsZXMvc3RvbmUucG5nJ1xuICAgIF1cbiAgfSxcbiAgbW9iaWxlRGVmczogW1xuICAgIHtcbiAgICAgIGltYWdlUGF0aHM6IFsnLi9zcmMvaW1nL21vYmlsZXMvOHdheV9tb2JpbGUucG5nJ10sXG4gICAgICBzdGFydFRpbGU6IHsgeDogMywgeTogMyB9XG4gICAgfSxcbiAgICB7XG4gICAgICBpbWFnZVBhdGhzOiBbJy4vc3JjL2ltZy9tb2JpbGVzLzh3YXlfbW9iaWxlLnBuZyddLFxuICAgICAgc3RhcnRUaWxlOiB7IHg6IDUsIHk6IDQgfVxuICAgIH0sXG4gICAge1xuICAgICAgaW1hZ2VQYXRoczogWycuL3NyYy9pbWcvbW9iaWxlcy84d2F5X21vYmlsZS5wbmcnXSxcbiAgICAgIHN0YXJ0VGlsZTogeyB4OiAzLCB5OiA2IH1cbiAgICB9XG4gIF1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCAnLi9zdHlsZXMvaW5kZXguY3NzJztcblxuaW1wb3J0IHsgSW5wdXQgfSBmcm9tICcuL2lucHV0JztcbmltcG9ydCBTY2VuZSBmcm9tICcuL3NjZW5lJztcbmltcG9ydCB7IHNjZW5lRGVmIH0gZnJvbSAnLi9zY2VuZV9kZWZpbml0aW9uJztcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnUHJveG1hIFJldmVyaWUgYXBwcm9hY2hlcyEnKTtcblxuICBsZXQgdGlja0xlbmd0aCA9IDUwO1xuXG4gIHZhciB2aWV3cG9ydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3cG9ydC1jYW52YXMnKTtcbiAgbGV0IHZpZXdwb3J0RGltZW5zaW9ucyA9IHsgeDogNjAwLCB5OiA0MDAgfTtcbiAgdmlld3BvcnQud2lkdGggPSB2aWV3cG9ydERpbWVuc2lvbnMueDtcbiAgdmlld3BvcnQuaGVpZ2h0ID0gdmlld3BvcnREaW1lbnNpb25zLnk7XG5cbiAgbGV0IHNjZW5lID0gbmV3IFNjZW5lKHNjZW5lRGVmLCB2aWV3cG9ydCwgdmlld3BvcnREaW1lbnNpb25zLCAoKSA9PiB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aWNrKCk7XG4gICAgfSwgMCk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHRpY2soKSB7XG4gICAgc2NlbmUudGljaygpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGljaygpO1xuICAgIH0sIHRpY2tMZW5ndGgpO1xuICB9XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGV2ZW50ID0+IHtcbiAgICBJbnB1dC5rZXlEb3duKGV2ZW50LmtleSk7XG4gIH0pO1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZXZlbnQgPT4ge1xuICAgIElucHV0LmtleVVwKGV2ZW50LmtleSk7XG4gIH0pO1xuXG4gIHZpZXdwb3J0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBldmVudCA9PiB7XG4gICAgSW5wdXQubW91c2VVcChldmVudCk7XG4gIH0pO1xufSk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNoSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///0\n")},,function(module,exports,__webpack_require__){eval("// extracted by mini-css-extract-plugin//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9zdHlsZXMvaW5kZXguY3NzPzU5ZDAiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIl0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///2\n")}]);