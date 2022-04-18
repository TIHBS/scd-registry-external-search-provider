package com.scdregistry.searchprovider.util

import org.elasticsearch.common.unit.Fuzziness
import org.elasticsearch.index.query.QueryBuilder
import org.elasticsearch.index.query.QueryBuilders
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable

fun <T> listToPageable(list: List<T>, pageable: Pageable): Page<T> {
    val start = pageable.offset.toInt()
    var end = start + pageable.pageSize
    if (end > list.size) {
        end = list.size
    }
    return PageImpl(list.subList(start, end), pageable, list.size.toLong())
}

fun <T> createFullTextQuery(clazz: Class<T>, query: String): QueryBuilder {
    val queryBuilder = QueryBuilders.multiMatchQuery(query)
    val params = clazz.typeParameters.map { param -> param.name }

    params.forEach { param -> queryBuilder.field(param) }
    return queryBuilder.fuzziness(Fuzziness.AUTO)
}
