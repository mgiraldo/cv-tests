import os
import random
import cPickle as pickle
import numpy as np
import keras
from keras.preprocessing import image
from keras.applications.imagenet_utils import decode_predictions, preprocess_input
from keras.models import Model
from sklearn.decomposition import PCA
from scipy.spatial import distance
from tqdm import tqdm
import json
import PIL
import urllib, cStringIO

def get_model():
    return keras.applications.VGG16(weights='imagenet', include_top=True)

def process_image(img):
    """ will return a numpy array of the pixels to input to the network """
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    return x

def get_image_url(url):
    file = cStringIO.StringIO(urllib.urlopen(url).read())
    img = PIL.Image.open(file)
    target_size = model.input_shape[1:3]
    width_height_tuple = (target_size[1], target_size[0])
    interpolation='nearest'
    img = img.resize(width_height_tuple, PIL.Image.NEAREST)
    colors_url = 'http://localhost:4567/?url=%s' % url
    colors_json = json.loads(urllib.urlopen(colors_url).read())
    colors = parse_colors(colors_json)
    return img, colors

def get_image(path):
    img = image.load_img(path, target_size=model.input_shape[1:3])
    return img

def n(norm_type, value, scale = 10.0):
    if (norm_type == "h"):
        return float(value)/360.0*scale
    elif (norm_type == "sv"):
        return float(value)/100.0*scale
    elif (norm_type == "rgb"):
        return float(value)/255.0*scale

def parse_colors(j):
    colors = []
    for c in j['imgdata'][1]['clusters']['cluster']:
        f = float(c[0]['f'])
        r, g, b = n("rgb", c[1]['rgb'][0]['r']), n("rgb", c[1]['rgb'][0]['g']), n("rgb", c[1]['rgb'][0]['b'])
        hx = c[2]['hex'][0]['hex']
        h, s, v = n("h", c[3]['hsv'][0]['h']), n("sv", c[3]['hsv'][0]['s']), n("sv", c[3]['hsv'][0]['v'])
        colors.append([f, hx, r, g, b, h, s, v])
    return colors

def organize_features(word_features, colors):
    """gets word and color values (minus hex) and builds a new weighted list for the image"""
    rgbhsv_list = []
    tmp_features = list(word_features)
    rgbhsv_all = zip(*colors)[2:]
    c1, c2, c3, c4, c5 = zip(*rgbhsv_all)
    [rgbhsv_list.extend(c) for c in [c1, c2, c3, c4, c5]]
    tmp_features.extend(rgbhsv_list)
    return tmp_features

def search(x, colors):
    feat = feat_extractor.predict(x)[0]
    all_feats = organize_features(feat, colors)
    feature_values = np.array([x for x in all_feats])
    feat_pca = pca.transform([feature_values])
    distances = [ distance.euclidean(feat_pca, f) for f in pca_features ]
    idx_closest = sorted(range(len(distances)), key=lambda k: distances[k])[0:10]
    files_closest = [images[i] for i in idx_closest]
    print(files_closest)

np.seterr(divide='ignore', invalid='ignore')
model = get_model()
feat_extractor = Model(inputs=model.input, outputs=model.get_layer("fc2").output)
images, pca_features, pca = pickle.load(open('../output-ml4a/colors-v4-features.p', 'r'))

if __name__ == '__main__':
    while True:
        url = raw_input('url: ')
        try:
            img, colors = get_image_url(url)
            x = process_image(img)
            search(x, colors)
        except IOError:
            print("error: url is not an image")
