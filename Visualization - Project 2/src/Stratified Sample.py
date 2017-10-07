import pandas as pd
import random
import numpy
import math
import scipy.stats
from sklearn import cluster, metrics
from sklearn.decomposition import PCA
from sklearn.manifold import MDS
import matplotlib.pyplot as plt


def get_k(df):
    array = []
    k_vals =[]
    pairs = []
    i=1

    while(i<=20):
        km = cluster.KMeans(n_clusters=i)
        km.fit(df)
        array.append(km.inertia_)
        pairs.append((i,km.inertia_))
        k_vals.append(i)
        i=i+1

    #plt.plot(k_vals, array)
    #plt.show()

    DF_dictionary = pd.DataFrame(pairs)
    DF_dictionary.columns = ['k-value','values']
    DF_dictionary.to_csv('./data/kmean.csv',sep=',',index=False)

def get_stratified_sample(df,cluster_count,fraction):
    kMean = cluster.KMeans(n_clusters=cluster_count)
    kMean.fit(df)
    df['kmean'] = kMean.labels_
    result_data_frame = pd.DataFrame([],columns=df.columns.values) 
    for i in range(cluster_count):
        temp = df.loc[df['kmean']==i]   
        #print temp
        length = len(temp.index)
        #print length
        random_index = random.sample(range(length),int(length*fraction))
        #print random_index
        random_data_frame = temp.iloc[random_index]
        #print random_data_frame
        result_data_frame = result_data_frame.append(random_data_frame)
        #print result_data_frame
    result_data_frame = result_data_frame.drop('kmean',1)
    #print result_data_frame.head()

    return result_data_frame

def get_pca(df):
    col_headers= df.columns.values
    #print col_names
    principal_compo_analy=PCA()
    principal_compo_analy.fit_transform(df)
    Eigen_values2 = principal_compo_analy.explained_variance_
    #print eigen_values_1
    #print len(eigen_values_1)
    Componenets_stratified = principal_compo_analy.components_
    #print Componenets_random

    Components_df2 = pd.DataFrame(Componenets_stratified)

    Eigen_Set2 = []
    for i in range(len(Eigen_values2)):
        Eigen_Set2.append((i+1,Eigen_values2[i]))

    #print Eigen_Set1
    eigen_df = pd.DataFrame(Eigen_Set2)
    #print eigen_df
    filename = './data/pca_eigen_values2.csv'
    eigen_df.columns = ['variable','Eigen Values']
    #print eigen_df
    eigen_df.to_csv(filename,sep=',')
    # plt.plot(Eigen_values1)
    # plt.show()

    # By observing the Eigen value plot no_of_components is found to be 3

    sq_sum_1 = {}

    for i in range(len(Componenets_stratified[0])):
        sum = 0
        for j in range(3):
            sum += math.pow(Componenets_stratified[j][i],2)
        s = col_headers[i]
        sq_sum_1[s] = sum

    #sq_sum_2 = {}

    # for i in range(len(top_2[0])):
    #     sum = 0
    #     for j in range(4):
    #         sum += top_2[j][i]**2
    #     s = col_names[i]
    #     sq_sum_2[s] = sum

    tup_list = []
    for i in range(len(col_headers)):
        tup_list.append((col_headers[i],sq_sum_1[col_headers[i]]))
    tup_list = sorted(tup_list, key=lambda x:-1*x[1])    
    
    file_name = './data/scree_loadings_stratified.csv'
    tupDF = pd.DataFrame(tup_list)
    tupDF.columns = ['variable','Sum of Squared Loadings']
    tupDF.to_csv(file_name,sep=',')

    top3feat =[]
    for i in range(3):
        top3feat.append(tup_list[i][0])

    to_save = df[top3feat];
    to_save.to_csv("data/pca3_stratified.csv")

    pca = PCA(n_components=3)
    data_frame = pd.DataFrame(pca.fit_transform(df))

    data_frame.columns = ['PC1','PC2','PC3']
    filename='./data/PCA2_stratified.csv'
    data_frame.to_csv(filename,sep=',')


def find_MDS_euclidean(data_frame):
    mds = MDS(n_components=2,dissimilarity='euclidean')
    df_new = pd.DataFrame(mds.fit_transform(data_frame))
    df_new.columns = ['PC1','PC2']
    list1=[]
    list1.append(df_new.loc[:,'PC1'])
    list2=[]
    list2.append(df_new.loc[:,'PC2'])
    plt.scatter(list1,list2)
    #plt.show()
    df_new.to_csv('./data/mds_euc_stratified.csv',sep=',')


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
    #df.to_csv('mds_euc.csv',sep=',')
    df.to_csv('./data/mds_corr_stratified.csv',sep=',')    


def main():

    df = pd.read_csv("/Users/aruno/Desktop/visproj2/src 2/data/uis.csv")
    df = df.drop('Unnamed: 0', 1)
    df = df.fillna(df.mean())
    df = (df-df.mean())/df.std();

    get_k(df)	
    # elbow is at 3 therefore, number of clusters to be created are 3
    stratified_samples = get_stratified_sample(df,4,0.8)

    get_pca(stratified_samples) 

    find_MDS_euclidean(stratified_samples)
    find_MDS_correlation(stratified_samples)

if __name__=='__main__':
        main()