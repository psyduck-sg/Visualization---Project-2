import pandas as pd
import random
import numpy
import scipy.stats
import math
from sklearn import cluster, metrics
from sklearn.decomposition import PCA
from sklearn.manifold import MDS
import matplotlib.pyplot as plt


def get_random_sample(df,f):
    rows = random.sample(df.index,(int)(len(df)*f))
    return df.iloc[rows]


def get_pca(df):
    col_headers= df.columns.values
    principal_compo_analy=PCA()
    principal_compo_analy.fit_transform(df)
    Eigen_values1 = principal_compo_analy.explained_variance_
    Componenets_random = principal_compo_analy.components_
    Components_df1 = pd.DataFrame(Componenets_random)

    Eigen_Set1 = []
    for i in range(len(Eigen_values1)):
        Eigen_Set1.append((i+1,Eigen_values1[i]))

    eigen_df = pd.DataFrame(Eigen_Set1)
    filename = './data/pca_eigen_values1.csv'
    eigen_df.columns = ['variable','Eigen Values']
    #print eigen_df
    eigen_df.to_csv(filename,sep=',')
    # plt.plot(Eigen_values1)
    # plt.show()

    int_dim = 0
    for val in Eigen_values1:
        if(val>1):
            int_dim+=1
    # By observing the Eigen value plot no_of_components is found to be 3

    sq_sum_1 = {}

    for i in range(len(Componenets_random[0])):
        sum = 0
        for j in range(int_dim):
            sum += math.pow(Componenets_random[j][i],2)
        s = col_headers[i]
        sq_sum_1[s] = sum


    tup_list = []
    for i in range(len(col_headers)):
        tup_list.append((col_headers[i],sq_sum_1[col_headers[i]]))
    tup_list = sorted(tup_list, key=lambda x:-1*x[1])
    #print tup_list
        
    file_name = './data/scree_loadings_random.csv'
    tupDF = pd.DataFrame(tup_list)
    tupDF.columns = ['variable','Sum of Squared Loadings']
    tupDF.to_csv(file_name,sep=',')

    top3feat =[]
    for i in range(3):
        top3feat.append(tup_list[i][0])

    to_save = df[top3feat];
    to_save.to_csv("data/pca3_random.csv")
    
    pca = PCA(n_components=3)
    data_frame = pd.DataFrame(pca.fit_transform(df))
    data_frame.columns = ['PC1','PC2','PC3']
    filename='./data/PCA2_random.csv'
    data_frame.to_csv(filename,sep=',')


def find_MDS_euclidean(data_frame):
    mds = MDS(n_components=2,dissimilarity='euclidean')
    df_new = pd.DataFrame(mds.fit_transform(data_frame))
    df_new.columns = ['PC1','PC2']
    list1=[]
    list1.append(df_new.loc[:,'PC1'])
    list2=[]
    list2.append(df_new.loc[:,'PC2'])
    # plt.scatter(list1,list2)
    # plt.show()
    df_new.to_csv('./data/mds_euc.csv',sep=',')


def find_MDS_correlation(data_frame):
    dis_mat = metrics.pairwise_distances(data_frame, metric = 'correlation')
    mds = MDS(n_components=2, dissimilarity='precomputed')
    df = pd.DataFrame(mds.fit_transform(dis_mat))
    df.columns = ['PC1','PC2']
    list1=[]
    list1.append(df.loc[:,'PC1'])
    list2=[]
    list2.append(df.loc[:,'PC2'])
    plt.scatter(list1,list2)
    #plt.show()
    df.to_csv('./data/mds_corr.csv',sep=',')    

def main():

    df = pd.read_csv("/Users/aruno/Desktop/visproj2/src 2/data/uis.csv")
    df = df.drop('Unnamed: 0', 1)
    #print df

    df = (df-df.mean())/df.std()
    df = df.fillna(df.mean())
    random_samples = get_random_sample(df,0.8)

    get_pca(random_samples) 

    find_MDS_euclidean(random_samples)
    find_MDS_correlation(random_samples)


if __name__=='__main__':
        main()