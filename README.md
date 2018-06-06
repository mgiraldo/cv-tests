# computer vision tests

playing around with some computer vision and machine learning algorithms

tests done in the [“world war i posters” search](https://dp.la/search?q=world+war+i+poster) in DPLA which contains about 2,300 images from different sources. a list of ids and urls can be found in [`data/images.ndjson`](data/images.ndjson)

## download the thumbnails

use the [`data/download.sh`](data/download.sh) script to get all the thumbnails. the script requires [jq](https://stedolan.github.io/jq/)

## [grid viewer demo](https://mgiraldo.github.io/cv-tests/output-ml4a/viewer-grid.html)

uses [localForage](https://localforage.github.io/localForage/) for list management

## more to come soon... ⏳

## see also

* [Gene Kogan's ML for artists guides](https://ml4a.github.io/guides/)
* [YOLO object detection](https://pjreddie.com/darknet/yolo/)
* [Gene Kogan's reverse image search guide](https://github.com/ml4a/ml4a-guides/blob/e3fff22bdd2b42543d32aadecb39038bcf5aca15/notebooks/image-search.ipynb)
* [Gene Kogan's t-SNE clustering guide](https://github.com/ml4a/ml4a-guides/blob/master/notebooks/image-tsne.ipynb)
* [Mario Klingemann's Raster Fairy](https://github.com/Quasimondo/RasterFairy)
